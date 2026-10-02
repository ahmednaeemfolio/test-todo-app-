import { Module } from "@nestjs/common";
import { TodoMutationsModule } from "./todos/todo-mutations.module";
import { TodosModule } from "./todos/todos.module";

@Module({
  imports: [TodosModule, TodoMutationsModule],
})
export class AppModule {}
