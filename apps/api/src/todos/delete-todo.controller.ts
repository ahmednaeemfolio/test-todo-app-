import { Controller, Delete, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { DeleteTodoService } from './delete-todo.service';

// Keep deletion available through the same public collection API as todo reads.
@Public()
@Controller('todos')
export class DeleteTodoController {
  constructor(private readonly deleteTodoService: DeleteTodoService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTodo(@Param('id') id: string): Promise<void> {
    await this.deleteTodoService.deleteTodo(id);
  }
}
