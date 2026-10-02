import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { TodoMutationsController } from "./todo-mutations.controller";
import { TodoMutationsService } from "./todo-mutations.service";

@Module({
  imports: [PrismaModule],
  controllers: [TodoMutationsController],
  providers: [TodoMutationsService],
  exports: [TodoMutationsService],
})
export class TodoMutationsModule {}
