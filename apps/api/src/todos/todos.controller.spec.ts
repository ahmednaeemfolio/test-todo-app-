import { BadRequestException, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateTodoDto } from "./create-todo.dto";
import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";

describe("TodosController", () => {
  let controller: TodosController;
  let todosService: jest.Mocked<Pick<TodosService, "create" | "findAll" | "findOne">>;

  beforeEach(() => {
    todosService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
    controller = new TodosController(todosService as unknown as TodosService);
  });

  it("creates a todo with the trimmed title", async () => {
    const created = {
      id: "todo-1",
      title: "Buy milk",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    todosService.create.mockResolvedValue(created);
    const dto = plainToInstance(CreateTodoDto, { title: "  Buy milk  " });

    await expect(controller.create(dto)).resolves.toBe(created);
    expect(todosService.create).toHaveBeenCalledWith("Buy milk");
  });

  it("rejects a whitespace-only title", async () => {
    todosService.create.mockRejectedValue(new BadRequestException());
    const dto = plainToInstance(CreateTodoDto, { title: "   " });

    await expect(controller.create(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("returns all todos", async () => {
    const now = new Date();
    const todos = [
      {
        id: "todo-1",
        title: "Read",
        completed: false,
        createdAt: now,
        updatedAt: now,
      },
    ];
    todosService.findAll.mockResolvedValue(todos);

    await expect(controller.findAll()).resolves.toBe(todos);
    expect(todosService.findAll).toHaveBeenCalledTimes(1);
  });

  it("returns the requested todo", async () => {
    const now = new Date();
    const todo = {
      id: "todo-1",
      title: "Read",
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    todosService.findOne.mockResolvedValue(todo);

    await expect(controller.findOne("todo-1")).resolves.toBe(todo);
    expect(todosService.findOne).toHaveBeenCalledWith("todo-1");
  });

  it("propagates not found for an unknown id", async () => {
    todosService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne("missing")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
