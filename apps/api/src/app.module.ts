import { Module } from "@nestjs/common";
import { TodoMutationsModule } from "./todos/todo-mutations.module";
import { TodosModule } from "./todos/todos.module";

@Module({
  // Both feature modules expose the shared, unauthenticated Todo collection.
  imports: [TodosModule, TodoMutationsModule],
})
export class AppModule {}
