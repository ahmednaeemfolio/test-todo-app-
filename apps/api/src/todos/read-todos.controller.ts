import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Public } from '../common/public.decorator';
import { ReadTodosService } from './read-todos.service';

@Controller('todos')
export class ReadTodosController {
  constructor(private readonly readTodosService: ReadTodosService) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.readTodosService.findAll();
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.readTodosService.findOne(id);
  }
}
