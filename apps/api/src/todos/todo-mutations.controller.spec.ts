import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TodoMutationsController } from './todo-mutations.controller';
import { TodoMutationsService } from './todo-mutations.service';
import { UpdateTodoDto } from './update-todo.dto';

describe('TodoMutationsController', () => {
  let controller: TodoMutationsController;
  let todoUpdate: jest.Mock;
  let todoDelete: jest.Mock;

  const existingTodo = {
    id: 'todo-1',
    title: 'Buy groceries',
    completed: false,
    createdAt: new Date('2025-03-08T00:00:00.000Z'),
    updatedAt: new Date('2025-03-08T00:00:00.000Z'),
  };

  beforeEach(async () => {
    todoUpdate = jest.fn();
    todoDelete = jest.fn();
    const prisma = {
      todo: {
        update: todoUpdate,
        delete: todoDelete,
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoMutationsController],
      providers: [
        TodoMutationsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    controller = module.get<TodoMutationsController>(TodoMutationsController);
  });

  it('persists and returns a changed completion value', async () => {
    const updatedTodo = { ...existingTodo, completed: true };
    todoUpdate.mockResolvedValue(updatedTodo);

    await expect(
      controller.update('todo-1', { completed: true }),
    ).resolves.toEqual(updatedTodo);
    expect(todoUpdate).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
      data: { completed: true },
    });
  });

  it('persists a trimmed title and returns the updated todo', async () => {
    const updatedTodo = { ...existingTodo, title: 'Plan trip' };
    todoUpdate.mockResolvedValue(updatedTodo);

    await expect(
      controller.update('todo-1', { title: '  Plan trip  ' }),
    ).resolves.toEqual(updatedTodo);
    expect(todoUpdate).toHaveBeenCalledWith({
      where: { id: 'todo-1' },
      data: { title: 'Plan trip' },
    });
  });

  it.each(['', '   ', '\t\n'])('rejects an invalid edited title (%j)', async (title) => {
    await expect(
      controller.update('todo-1', { title } as UpdateTodoDto),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(todoUpdate).not.toHaveBeenCalled();
  });

  it('deletes the todo when the API receives a confirmed delete request', async () => {
    todoDelete.mockResolvedValue(existingTodo);

    await expect(controller.remove('todo-1')).resolves.toBeUndefined();
    expect(todoDelete).toHaveBeenCalledWith({ where: { id: 'todo-1' } });
  });

  it('returns not found for updates and deletes of unknown todos', async () => {
    todoUpdate.mockRejectedValue({ code: 'P2025' });
    todoDelete.mockRejectedValue({ code: 'P2025' });

    await expect(
      controller.update('missing', { completed: true }),
    ).rejects.toBeInstanceOf(NotFoundException);
    await expect(controller.remove('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
