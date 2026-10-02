import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateTodoDto } from "./update-todo.dto";

@Injectable()
export class TodoMutationsService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, changes: UpdateTodoDto) {
    if (Object.keys(changes).length === 0) {
      throw new BadRequestException("At least one todo field must be provided");
    }

    const data: { title?: string; completed?: boolean } = {};
    if (changes.title !== undefined) {
      const title = changes.title.trim();
      if (title.length === 0) {
        throw new BadRequestException("Title must not be empty");
      }
      data.title = title;
    }
    if (changes.completed !== undefined) {
      data.completed = changes.completed;
    }

    try {
      return await this.prisma.todo.update({ where: { id }, data });
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Prisma delete persists the removal and reports a missing id as P2025.
      await this.prisma.todo.delete({ where: { id } });
    } catch (error) {
      if (this.isRecordNotFound(error)) {
        throw new NotFoundException(`Todo with id ${id} not found`);
      }
      throw error;
    }
  }

  private isRecordNotFound(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    );
  }
}
