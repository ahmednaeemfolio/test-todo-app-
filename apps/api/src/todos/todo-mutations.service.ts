import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

@Injectable()
export class TodoMutationsService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, changes: UpdateTodoDto) {
    if (changes.title === undefined && changes.completed === undefined) {
      throw new BadRequestException('At least one todo field must be provided');
    }

    const data: { title?: string; completed?: boolean } = {};
    if (changes.title !== undefined) {
      if (typeof changes.title !== 'string' || changes.title.trim().length === 0) {
        throw new BadRequestException('title must contain at least one non-whitespace character');
      }
      data.title = changes.title.trim();
    }
    if (changes.completed !== undefined) {
      if (typeof changes.completed !== 'boolean') {
        throw new BadRequestException('completed must be a boolean');
      }
      data.completed = changes.completed;
    }

    try {
      return await this.prisma.todo.update({ where: { id }, data });
    } catch (error) {
      this.throwIfMissing(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.todo.delete({ where: { id } });
    } catch (error) {
      this.throwIfMissing(error);
      throw error;
    }
  }

  private throwIfMissing(error: unknown): void {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException('Todo not found');
    }
  }
}
