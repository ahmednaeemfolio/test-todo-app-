import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreateTodoService {
  constructor(private readonly prisma: PrismaService) {}

  create(title: string) {
    const normalizedTitle = title.trim();

    return this.prisma.todo.create({
      data: {
        title: normalizedTitle,
        completed: false,
      },
    });
  }
}
