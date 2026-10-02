import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(title: string) {
    // Keep this guard here as well as DTO transformation so direct service
    // callers cannot persist a blank title.
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new BadRequestException("Todo title must not be empty");
    }

    return this.prisma.todo.create({
      data: {
        title: title.trim(),
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
