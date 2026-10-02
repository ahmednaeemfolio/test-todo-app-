import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('The Prisma seed can only be run in development.');
  }

  await prisma.todo.upsert({
    where: { id: 'development-sample-todo' },
    create: {
      id: 'development-sample-todo',
      title: 'Try the shared todo list',
      completed: false,
    },
    update: {
      title: 'Try the shared todo list',
      completed: false,
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error('Failed to seed the development todo:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
