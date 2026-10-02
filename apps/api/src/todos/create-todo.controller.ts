import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { CreateTodoDto } from './create-todo.dto';
import { CreateTodoService } from './create-todo.service';

@Public()
@Controller('todos')
export class CreateTodoController {
  constructor(private readonly createTodoService: CreateTodoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.createTodoService.create(createTodoDto.title);
  }
}
