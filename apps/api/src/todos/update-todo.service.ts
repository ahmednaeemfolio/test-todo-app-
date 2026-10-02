import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

@Injectable()
export class UpdateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async updateTodo(id: string, dto: UpdateTodoDto) {
    try {
      return await this.prisma.todo.update({
        where: { id },
        data: {
          ...(dto.title !== undefined && { title: dto.title.trim() }),
          ...(dto.completed !== undefined && { completed: dto.completed }),
        },
        select: {
          id: true,
          title: true,
          completed: true,
          createdAt: true,
          updatedAt: true,
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
