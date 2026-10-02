import { Body, Controller, Post } from '@nestjs/common';
import { CreateTodoDto } from './create-todo.dto';
import { CreateTodoService } from './create-todo.service';

@Controller('todos')
export class CreateTodoController {
  constructor(private readonly createTodoService: CreateTodoService) {}

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.createTodoService.create(dto.title);
  }
}
