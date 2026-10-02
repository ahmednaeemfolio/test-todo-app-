import { Body, Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { UpdateTodoDto } from './update-todo.dto';
import { UpdateTodoService } from './update-todo.service';

@Public()
@Controller('todos')
export class UpdateTodoController {
  constructor(private readonly updateTodoService: UpdateTodoService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.updateTodoService.update(id, updateTodoDto);
  }
}
