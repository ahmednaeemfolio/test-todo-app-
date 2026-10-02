import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { UpdateTodoDto } from './update-todo.dto';
import { UpdateTodoService } from './update-todo.service';

@Public()
@Controller('todos')
export class UpdateTodoController {
  constructor(private readonly updateTodoService: UpdateTodoService) {}

  @Patch(':id')
  updateTodo(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    if (dto.title === undefined && dto.completed === undefined) {
      throw new BadRequestException('At least one todo field must be provided');
    }

    return this.updateTodoService.updateTodo(id, dto);
  }
}
