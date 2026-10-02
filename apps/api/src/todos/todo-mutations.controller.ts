import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from "@nestjs/common";
import { UpdateTodoDto } from "./update-todo.dto";
import { TodoMutationsService } from "./todo-mutations.service";

@Controller("todos")
export class TodoMutationsController {
  constructor(private readonly todoMutationsService: TodoMutationsService) {}

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoMutationsService.update(id, updateTodoDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string): Promise<void> {
    await this.todoMutationsService.remove(id);
  }
}
