import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './create-todo.dto';

@Injectable()
export class CreateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: dto.title,
        completed: false,
      },
    });
  }
}
