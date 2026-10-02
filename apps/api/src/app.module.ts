import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { PublicRouteGuard } from './common/public-route.guard';
import { CreateTodoController } from './todos/create-todo.controller';
import { DeleteTodoController } from './todos/delete-todo.controller';
import { ReadTodosController } from './todos/read-todos.controller';
import { UpdateTodoController } from './todos/update-todo.controller';
import { CreateTodoService } from './todos/create-todo.service';
import { DeleteTodoService } from './todos/delete-todo.service';
import { ReadTodosService } from './todos/read-todos.service';
import { UpdateTodoService } from './todos/update-todo.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateTodoController,
    ReadTodosController,
    UpdateTodoController,
    DeleteTodoController,
  ],
  providers: [
    CreateTodoService,
    ReadTodosService,
    UpdateTodoService,
    DeleteTodoService,
    {
      provide: APP_GUARD,
      useClass: PublicRouteGuard,
    },
  ],
})
export class AppModule {}
