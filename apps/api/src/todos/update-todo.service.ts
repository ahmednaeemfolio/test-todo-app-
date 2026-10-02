import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

@Injectable()
export class UpdateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, input: UpdateTodoDto) {
    const data: { title?: string; completed?: boolean } = {};

    if (input.title !== undefined) {
      const title = input.title.trim();
      if (title.length === 0) {
        // Keep this guard for callers that invoke the service without DTO validation.
        throw new BadRequestException('title must not be empty or whitespace-only');
      }
      data.title = title;
    }

    if (input.completed !== undefined) {
      data.completed = input.completed;
    }

    try {
      return await this.prisma.todo.update({
        where: { id },
        data,
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
