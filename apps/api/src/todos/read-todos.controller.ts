import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { ReadTodosService } from './read-todos.service';

@Controller('todos')
export class ReadTodosController {
  constructor(private readonly readTodosService: ReadTodosService) {}

  @Public()
  @Get()
  findAll() {
    return this.readTodosService.findAll();
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.readTodosService.findById(id);
  }
}
