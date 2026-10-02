import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeleteTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteTodo(id: string): Promise<void> {
    const result = await this.prisma.todo.deleteMany({ where: { id } });

    if (result.count === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}
