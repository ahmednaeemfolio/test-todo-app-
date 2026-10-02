import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { ReadTodosService, TodoResponse } from './read-todos.service';

@Controller('todos')
export class ReadTodosController {
  constructor(private readonly readTodosService: ReadTodosService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<TodoResponse[]> {
    return this.readTodosService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string): Promise<TodoResponse> {
    return this.readTodosService.findById(id);
  }
}
