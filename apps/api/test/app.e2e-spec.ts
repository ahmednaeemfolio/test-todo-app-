import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

interface TodoResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

let app: INestApplication;
let baseUrl: string;
let prisma: PrismaService;

async function request(
  method: string,
  path: string,
  body?: unknown,
): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function expectTodoFields(todo: TodoResponse): void {
  expect(Object.keys(todo).sort()).toEqual(
    ['id', 'title', 'completed', 'createdAt', 'updatedAt'].sort(),
  );
  expect(todo.id).toEqual(expect.any(String));
  expect(todo.title).toEqual(expect.any(String));
  expect(typeof todo.completed).toBe('boolean');
  expect(Number.isNaN(Date.parse(todo.createdAt))).toBe(false);
  expect(Number.isNaN(Date.parse(todo.updatedAt))).toBe(false);
}

describe('Todo API application e2e', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.listen(0);
    baseUrl = await app.getUrl();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('wires create, list, read, update, and delete with persisted todo fields', async () => {
    const createResponse = await request('POST', '/todos', { title: 'Buy groceries' });
    expect(createResponse.status).toBe(201);
    const created = (await createResponse.json()) as TodoResponse;
    expectTodoFields(created);
    expect(created.title).toBe('Buy groceries');
    expect(created.completed).toBe(false);

    const listResponse = await request('GET', '/todos');
    expect(listResponse.status).toBe(200);
    const todos = (await listResponse.json()) as TodoResponse[];
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual(created);
    expectTodoFields(todos[0]);

    const readResponse = await request('GET', `/todos/${created.id}`);
    expect(readResponse.status).toBe(200);
    const readTodo = (await readResponse.json()) as TodoResponse;
    expect(readTodo).toEqual(created);
    expectTodoFields(readTodo);

    const updateResponse = await request('PATCH', `/todos/${created.id}`, {
      title: 'Buy groceries today',
      completed: true,
    });
    expect(updateResponse.status).toBe(200);
    const updated = (await updateResponse.json()) as TodoResponse;
    expectTodoFields(updated);
    expect(updated.title).toBe('Buy groceries today');
    expect(updated.completed).toBe(true);

    const persistedResponse = await request('GET', `/todos/${created.id}`);
    expect(persistedResponse.status).toBe(200);
    expect(await persistedResponse.json()).toEqual(updated);

    const deleteResponse = await request('DELETE', `/todos/${created.id}`);
    expect(deleteResponse.status).toBe(204);
    const emptyListResponse = await request('GET', '/todos');
    expect(emptyListResponse.status).toBe(200);
    expect(await emptyListResponse.json()).toEqual([]);
  });

  it('rejects missing, blank, and whitespace-only titles with client errors', async () => {
    const missingTitleResponse = await request('POST', '/todos', {});
    expect(missingTitleResponse.status).toBeGreaterThanOrEqual(400);
    expect(missingTitleResponse.status).toBeLessThan(500);

    for (const title of ['', '   ', '\n\t']) {
      const response = await request('POST', '/todos', { title });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    }

    const createResponse = await request('POST', '/todos', { title: 'Keep this title' });
    const todo = (await createResponse.json()) as TodoResponse;

    for (const title of ['', '   ', '\n\t']) {
      const response = await request('PATCH', `/todos/${todo.id}`, { title });
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.status).toBeLessThan(500);
    }

    const unchangedResponse = await request('GET', `/todos/${todo.id}`);
    expect(unchangedResponse.status).toBe(200);
    expect((await unchangedResponse.json() as TodoResponse).title).toBe('Keep this title');

    const listResponse = await request('GET', '/todos');
    expect(await listResponse.json()).toHaveLength(1);
  });
});
