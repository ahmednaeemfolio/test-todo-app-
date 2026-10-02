import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressInfo } from 'node:net';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Todo API application (e2e)', () => {
  let app: ReturnType<TestingModule['createNestApplication']>;
  let baseUrl: string;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Match the production bootstrap so DTO validation is exercised end-to-end.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: 422,
      }),
    );
    prisma = app.get(PrismaService);
    await app.listen(0, '127.0.0.1');
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await app?.close();
  });

  async function send(path: string, init: RequestInit = {}): Promise<Response> {
    return fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...init.headers,
      },
    });
  }

  it('creates, reads, partially updates, and deletes a persisted todo through all API routes', async () => {
    const uniqueTitle = `e2e todo ${Date.now()} ${Math.random()}`;
    let todoId: string | undefined;

    try {
      const createResponse = await send('/todos', {
        method: 'POST',
        body: JSON.stringify({ title: uniqueTitle }),
      });
      expect(createResponse.status).toBe(201);
      const created = await createResponse.json();
      expect(created).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: uniqueTitle,
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
      todoId = created.id;

      const listResponse = await send('/todos');
      expect(listResponse.status).toBe(200);
      const todos = await listResponse.json();
      expect(todos).toEqual(expect.arrayContaining([expect.objectContaining(created)]));

      const readResponse = await send(`/todos/${todoId}`);
      expect(readResponse.status).toBe(200);
      expect(await readResponse.json()).toEqual(expect.objectContaining(created));

      const titleResponse = await send(`/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated e2e todo' }),
      });
      expect(titleResponse.status).toBe(200);
      expect(await titleResponse.json()).toEqual(
        expect.objectContaining({ id: todoId, title: 'Updated e2e todo', completed: false }),
      );

      const completionResponse = await send(`/todos/${todoId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: true }),
      });
      expect(completionResponse.status).toBe(200);
      expect(await completionResponse.json()).toEqual(
        expect.objectContaining({ id: todoId, title: 'Updated e2e todo', completed: true }),
      );

      const persistedResponse = await send(`/todos/${todoId}`);
      expect(persistedResponse.status).toBe(200);
      expect(await persistedResponse.json()).toEqual(
        expect.objectContaining({
          id: todoId,
          title: 'Updated e2e todo',
          completed: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

      const deleteResponse = await send(`/todos/${todoId}`, { method: 'DELETE' });
      expect(deleteResponse.status).toBe(204);
      const missingResponse = await send(`/todos/${todoId}`);
      expect(missingResponse.status).toBe(404);
    } finally {
      // Keep the test isolated if an intermediate API assertion fails.
      if (todoId) {
        await prisma.todo.deleteMany({ where: { id: todoId } });
      }
    }
  });

  it('requires a title and rejects empty or whitespace-only titles without creating a todo', async () => {
    const before = await prisma.todo.count();

    for (const payload of [{}, { title: '' }, { title: '   \t  ' }]) {
      const response = await send('/todos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      expect(response.status).toBe(422);
    }

    expect(await prisma.todo.count()).toBe(before);
  });

  it('rejects empty and whitespace-only title updates with a client-error response', async () => {
    const created = await prisma.todo.create({
      data: { title: `validation fixture ${Date.now()} ${Math.random()}` },
    });

    try {
      for (const title of ['', '   \t  ']) {
        const response = await send(`/todos/${created.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title }),
        });
        expect(response.status).toBe(422);
      }

      const persisted = await prisma.todo.findUniqueOrThrow({ where: { id: created.id } });
      expect(persisted.title).toBe(created.title);
    } finally {
      await prisma.todo.deleteMany({ where: { id: created.id } });
    }
  });
});
