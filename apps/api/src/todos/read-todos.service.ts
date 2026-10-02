import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

  findAll(): Promise<TodoResponse[]> {
    return this.prisma.todo.findMany({ select: todoFields });
  }

  async findById(id: string): Promise<TodoResponse> {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      select: todoFields,
    });

    if (!todo) {
      throw new NotFoundException(`Todo with id "${id}" was not found`);
    }

    return todo;
  }
}
