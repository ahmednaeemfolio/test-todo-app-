import { PrismaClient } from '@prisma/client';

const sampleTodo = {
  id: 'development-sample-todo',
  title: 'Sample todo',
  completed: false,
};

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The development seed cannot be run in production.');
  }

  const prisma = new PrismaClient();

  try {
    await prisma.todo.upsert({
      where: { id: sampleTodo.id },
      update: {
        title: sampleTodo.title,
        completed: sampleTodo.completed,
      },
      create: sampleTodo,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed the development todo:', error);
  process.exitCode = 1;
});
