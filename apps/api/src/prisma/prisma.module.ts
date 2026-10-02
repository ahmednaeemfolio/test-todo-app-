import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** Provides a shared Prisma client to modules that import PrismaModule. */
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
