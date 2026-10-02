import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /** Establish the database connection when Nest initializes this module. */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /** Release the database connection when Nest destroys this module. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
