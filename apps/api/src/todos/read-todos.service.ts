import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const todoFields = {
  id: true,
  title: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class ReadTodosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany({ select: todoFields });
  }

  async findById(id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      select: todoFields,
    });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }
}
