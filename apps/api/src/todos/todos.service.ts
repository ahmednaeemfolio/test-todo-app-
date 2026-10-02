import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string) {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length === 0) {
      throw new BadRequestException("Todo title must not be empty");
    }

    return this.prisma.todo.create({
      data: {
        title: trimmedTitle,
        completed: false,
      },
    });
  }

  async findAll() {
    return this.prisma.todo.findMany();
  }

  async findOne(id: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }
}
