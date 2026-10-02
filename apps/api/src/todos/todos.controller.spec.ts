import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './create-todo.dto';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  const todo = {
    id: 'todo-1',
    title: 'Buy milk',
    completed: false,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  let controller: TodosController;
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
    controller = new TodosController(service);
  });

  it('creates a todo with a trimmed title and incomplete status', async () => {
    prisma.todo.create.mockResolvedValue(todo);

    await expect(controller.create({ title: '  Buy milk  ' } as CreateTodoDto)).resolves.toEqual(todo);
    expect(prisma.todo.create).toHaveBeenCalledWith({
      data: { title: 'Buy milk', completed: false },
    });
  });

  it.each(['', '  ', '\t\n'])('rejects a blank title: %j', async (title) => {
    await expect(controller.create({ title })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.todo.create).not.toHaveBeenCalled();
  });

  it('returns all todos', async () => {
    prisma.todo.findMany.mockResolvedValue([todo]);

    await expect(controller.findAll()).resolves.toEqual([todo]);
    expect(prisma.todo.findMany).toHaveBeenCalledTimes(1);
  });

  it('returns a todo by id', async () => {
    prisma.todo.findUnique.mockResolvedValue(todo);

    await expect(controller.findOne('todo-1')).resolves.toEqual(todo);
    expect(prisma.todo.findUnique).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
    });
  });

  it('returns not found when the requested todo does not exist', async () => {
    prisma.todo.findUnique.mockResolvedValue(null);

    await expect(controller.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
