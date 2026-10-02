import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('The todo seed can only be run in development.');
  }

  const prisma = new PrismaClient();
  try {
    await prisma.todo.upsert({
      where: { id: 'development-sample-todo' },
      create: {
        id: 'development-sample-todo',
        title: 'Sample todo',
        completed: false,
      },
      update: {
        title: 'Sample todo',
        completed: false,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
