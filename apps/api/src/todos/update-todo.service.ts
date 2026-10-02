import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTodoDto } from './update-todo.dto';

export interface UpdatedTodo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UpdateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<UpdatedTodo> {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return this.prisma.todo.update({
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
  }
}
