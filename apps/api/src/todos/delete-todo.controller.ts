import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { DeleteTodoService } from './delete-todo.service';

@Controller('todos')
export class DeleteTodoController {
  constructor(private readonly deleteTodoService: DeleteTodoService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async deleteTodo(@Param('id') id: string): Promise<void> {
    await this.deleteTodoService.deleteTodo(id);
  }
}
