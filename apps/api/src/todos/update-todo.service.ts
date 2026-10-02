import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

@Injectable()
export class UpdateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    try {
      return await this.prisma.todo.update({
        where: { id },
        data: {
          ...(updateTodoDto.title !== undefined && {
            title: updateTodoDto.title,
          }),
          ...(updateTodoDto.completed !== undefined && {
            completed: updateTodoDto.completed,
          }),
        },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      throw error;
    }
  }
}
