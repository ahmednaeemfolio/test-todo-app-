import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UpdateTodoDto } from './update-todo.dto';
import { UpdateTodoService } from './update-todo.service';

@Controller('todos')
export class UpdateTodoController {
  constructor(private readonly updateTodoService: UpdateTodoService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateTodoDto) {
    return this.updateTodoService.update(id, input);
  }
}
