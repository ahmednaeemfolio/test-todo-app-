import { Module } from '@nestjs/common';

/** Base Nest module for application-wide configuration. */
@Module({})
export class AppConfigModule {}

/** Shared configuration values read from the process environment. */
export const appConfig = {
  port: Number.parseInt(process.env.PORT ?? '3001', 10),
  environment: process.env.NODE_ENV ?? 'development',
  databaseUrl: process.env.DATABASE_URL,
};
