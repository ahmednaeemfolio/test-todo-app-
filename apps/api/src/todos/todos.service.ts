import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './create-todo.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    const title = createTodoDto.title.trim();
    if (title.length === 0) {
      throw new BadRequestException('title must not be empty');
    }

    return this.prisma.todo.create({
      data: {
        title,
        completed: false,
      },
    });
  }

  findAll() {
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
