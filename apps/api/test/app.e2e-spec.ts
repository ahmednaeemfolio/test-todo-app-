import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AddressInfo } from 'node:net';
import { AppModule } from '../src/app.module';

interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

describe('Todo API (e2e)', () => {
  let app: Awaited<ReturnType<typeof NestFactory.create>>;
  let baseUrl: string;
  let createdTodoId: string | undefined;

  const request = (path: string, init?: RequestInit) =>
    fetch(`${baseUrl}${path}`, init);

  beforeAll(async () => {
    app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.listen(0, '127.0.0.1');
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (createdTodoId) {
      await request(`/todos/${createdTodoId}`, { method: 'DELETE' });
    }
    await app.close();
  });

  it('creates, lists, reads, updates, and deletes persisted todos', async () => {
    const initialTitle = `e2e todo ${Date.now()}`;
    const createResponse = await request('/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: initialTitle }),
    });

    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as TodoResponse;
    createdTodoId = created.id;
    expect(created).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: initialTitle,
        completed: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );

    const listResponse = await request('/todos');
    expect(listResponse.status).toBe(200);
    const todos = (await listResponse.json()) as TodoResponse[];
    expect(todos).toEqual(expect.arrayContaining([expect.objectContaining(created)]));

    const readResponse = await request(`/todos/${created.id}`);
    expect(readResponse.status).toBe(200);
    expect(await readResponse.json()).toEqual(created);

    const updatedTitle = `${initialTitle} updated`;
    const updateResponse = await request(`/todos/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle, completed: true }),
    });
    expect(updateResponse.status).toBe(200);
    const updated = (await updateResponse.json()) as TodoResponse;
    expect(updated).toEqual(
      expect.objectContaining({
        id: created.id,
        title: updatedTitle,
        completed: true,
        createdAt: created.createdAt,
        updatedAt: expect.any(String),
      }),
    );

    const persistedResponse = await request(`/todos/${created.id}`);
    expect(persistedResponse.status).toBe(200);
    expect(await persistedResponse.json()).toEqual(updated);

    const deleteResponse = await request(`/todos/${created.id}`, {
      method: 'DELETE',
    });
    expect(deleteResponse.status).toBe(204);
    createdTodoId = undefined;

    const missingResponse = await request(`/todos/${created.id}`);
    expect(missingResponse.status).toBe(404);
  });

  it('rejects missing, blank, and whitespace-only titles with client errors', async () => {
    for (const body of [{}, { title: '' }, { title: '   \t\n' }]) {
      const response = await request('/todos', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    }
  });

  it('rejects blank title updates and leaves the persisted title unchanged', async () => {
    const title = `validation todo ${Date.now()}`;
    const createResponse = await request('/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as TodoResponse;
    createdTodoId = created.id;

    for (const invalidTitle of ['', '   \t\n']) {
      const response = await request(`/todos/${created.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: invalidTitle }),
      });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    }

    const readResponse = await request(`/todos/${created.id}`);
    expect((await readResponse.json() as TodoResponse).title).toBe(title);
  });
});
