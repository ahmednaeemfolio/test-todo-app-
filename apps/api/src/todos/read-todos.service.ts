import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const todoSummarySelect = {
  id: true,
  title: true,
  completed: true,
  createdAt: true,
  updatedAt: true,
} as const;

interface TodoSummary {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ReadTodosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<TodoSummary[]> {
    return this.prisma.todo.findMany({ select: todoSummarySelect });
  }

  async findById(id: string): Promise<TodoSummary> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      select: todoSummarySelect,
    });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }
}
