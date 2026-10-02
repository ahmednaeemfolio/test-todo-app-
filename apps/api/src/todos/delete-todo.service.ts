import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeleteTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteTodo(id: string): Promise<void> {
    // deleteMany makes the existence check and deletion a single atomic operation.
    const { count } = await this.prisma.todo.deleteMany({ where: { id } });

    if (count === 0) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }
  }
}
