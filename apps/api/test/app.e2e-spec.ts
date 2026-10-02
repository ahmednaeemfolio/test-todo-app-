import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

interface TodoPayload {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const testTitle = `application-e2e-${Date.now()}`;

describe('Todo API (application e2e)', () => {
  let app: INestApplication | undefined;
  let baseUrl = '';
  let prisma: PrismaService | undefined;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        errorHttpStatusCode: 422,
      }),
    );
    await app.listen(0);
    baseUrl = await app.getUrl();
    prisma = app.get(PrismaService);
    await prisma.todo.deleteMany({
      where: { title: { startsWith: testTitle } },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.todo.deleteMany({
        where: { title: { startsWith: testTitle } },
      });
    }
    await app?.close();
  });

  async function request(path: string, init?: RequestInit): Promise<Response> {
    return fetch(`${baseUrl}${path}`, init);
  }

  function expectTodoFields(todo: TodoPayload): void {
    expect(todo).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        completed: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  }

  it('creates, lists, reads, updates, and deletes a persisted todo', async () => {
    const title = `${testTitle}-crud`;
    const createResponse = await request('/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as TodoPayload;
    expectTodoFields(created);
    expect(created.title).toBe(title);
    expect(created.completed).toBe(false);
    expect(Number.isNaN(Date.parse(created.createdAt))).toBe(false);
    expect(Number.isNaN(Date.parse(created.updatedAt))).toBe(false);

    const listResponse = await request('/todos');
    expect(listResponse.status).toBe(200);
    const todos = (await listResponse.json()) as TodoPayload[];
    const listed = todos.find((todo) => todo.id === created.id);
    expect(listed).toBeDefined();
    expectTodoFields(listed!);
    expect(listed?.title).toBe(title);

    const readResponse = await request(`/todos/${created.id}`);
    expect(readResponse.status).toBe(200);
    const readTodo = (await readResponse.json()) as TodoPayload;
    expectTodoFields(readTodo);
    expect(readTodo).toMatchObject({
      id: created.id,
      title,
      completed: false,
    });

    const emptyTitleResponse = await request(`/todos/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });
    expect(emptyTitleResponse.status).toBe(422);

    const updateResponse = await request(`/todos/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: `${title}-updated`, completed: true }),
    });
    expect(updateResponse.status).toBe(200);
    const updated = (await updateResponse.json()) as TodoPayload;
    expectTodoFields(updated);
    expect(updated).toMatchObject({
      id: created.id,
      title: `${title}-updated`,
      completed: true,
    });

    const persistedResponse = await request(`/todos/${created.id}`);
    expect(persistedResponse.status).toBe(200);
    const persisted = (await persistedResponse.json()) as TodoPayload;
    expect(persisted).toMatchObject({
      id: created.id,
      title: `${title}-updated`,
      completed: true,
    });

    const deleteResponse = await request(`/todos/${created.id}`, {
      method: 'DELETE',
    });
    expect(deleteResponse.status).toBe(204);

    const deletedResponse = await request(`/todos/${created.id}`);
    expect(deletedResponse.status).toBe(404);
  });

  it.each(['', '   ', '\t\n'])('rejects a blank create title (%j)', async (title) => {
    const response = await request('/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    expect(response.status).toBe(422);
  });
});
