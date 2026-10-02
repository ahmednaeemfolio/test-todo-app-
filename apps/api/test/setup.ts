import 'reflect-metadata';

// Keep the test environment deterministic and aligned with local defaults.
process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3001';
process.env.DATABASE_URL ??=
  'postgresql://postgres:postgres@localhost:5432/todo_app?schema=public';
