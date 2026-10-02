import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { CreateTodoDto } from './create-todo.dto';
import { CreateTodoService } from './create-todo.service';

@Controller('todos')
@Public()
export class CreateTodoController {
  constructor(private readonly createTodoService: CreateTodoService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(@Body() dto: CreateTodoDto) {
    return this.createTodoService.create(dto);
  }
}
