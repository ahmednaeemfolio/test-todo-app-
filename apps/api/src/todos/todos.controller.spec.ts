import { BadRequestException, NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../prisma/prisma.service";
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

describe("TodosService", () => {
  let service: TodosService;
  let prisma: {
    todo: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      todo: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    service = new TodosService(prisma as unknown as PrismaService);
  });

  it("persists a trimmed, incomplete todo and returns its database fields", async () => {
    const created = {
      id: "todo-1",
      title: "Buy milk",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    prisma.todo.create.mockResolvedValue(created);

    await expect(service.create("  Buy milk  ")).resolves.toBe(created);
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: "Buy milk", completed: false },
    });
  });

  it("does not persist a blank title", async () => {
    await expect(service.create("   ")).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.todo.create).not.toHaveBeenCalled();
  });

  it("retrieves the complete list from Prisma", async () => {
    const todos = [{ id: "todo-1", title: "Read", completed: false }];
    prisma.todo.findMany.mockResolvedValue(todos);

    await expect(service.findAll()).resolves.toBe(todos);
    expect(prisma.todo.findMany).toHaveBeenCalledWith();
  });

  it("retrieves one todo by id and raises not found when it is absent", async () => {
    const todo = { id: "todo-1", title: "Read", completed: false };
    prisma.todo.findUnique.mockResolvedValueOnce(todo).mockResolvedValueOnce(null);

    await expect(service.findOne("todo-1")).resolves.toBe(todo);
    expect(prisma.todo.findUnique).toHaveBeenNthCalledWith(1, {
      where: { id: "todo-1" },
    });
    await expect(service.findOne("missing")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
