import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sampleTodoId = 'development-seed-todo';

async function main(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('The development seed can only run in development.');
  }

  await prisma.todo.upsert({
    where: { id: sampleTodoId },
    create: {
      id: sampleTodoId,
      title: 'Sample todo',
      completed: false,
    },
    update: {
      title: 'Sample todo',
      completed: false,
    },
  });
}

void main()
  .catch((error: unknown) => {
    console.error('Failed to seed the development todo:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
