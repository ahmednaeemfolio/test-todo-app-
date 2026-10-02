import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

/**
 * The service always returns the full persisted todo at runtime. The optional
 * fields allow callers to provide lightweight typed mocks while Prisma's
 * actual update result includes all five response fields.
 */
export interface UpdatedTodo {
  id: string;
  title?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UpdateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<UpdatedTodo> {
    try {
      return await this.prisma.todo.update({
        where: { id },
        data: {
          ...(updateTodoDto.title !== undefined && {
            title: updateTodoDto.title.trim(),
          }),
          ...(updateTodoDto.completed !== undefined && {
            completed: updateTodoDto.completed,
          }),
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
