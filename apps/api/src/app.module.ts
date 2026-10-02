import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Public } from './common/public.decorator';
import { PublicRouteGuard } from './common/public-route.guard';
import { PrismaModule } from './prisma/prisma.module';
import { CreateTodoController } from './todos/create-todo.controller';
import { CreateTodoService } from './todos/create-todo.service';
import { DeleteTodoController } from './todos/delete-todo.controller';
import { DeleteTodoService } from './todos/delete-todo.service';
import { ReadTodosController } from './todos/read-todos.controller';
import { ReadTodosService } from './todos/read-todos.service';
import { UpdateTodoController } from './todos/update-todo.controller';
import { UpdateTodoService } from './todos/update-todo.service';

// The update controller is part of the shared, unauthenticated todo API too.
// Mark it public here because its controller is owned by the feature task.
Public()(UpdateTodoController);

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
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class AppModule {}
