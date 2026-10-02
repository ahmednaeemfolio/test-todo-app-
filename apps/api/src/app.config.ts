import { Module } from '@nestjs/common';

export const APP_CONFIG = Symbol('APP_CONFIG');

export interface AppConfiguration {
  port: number;
  databaseUrl: string | undefined;
}

export function appConfiguration(): AppConfiguration {
  return {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL,
  };
}

/** Base application configuration; feature modules are added by their owning tasks. */
@Module({
  providers: [{ provide: APP_CONFIG, useFactory: appConfiguration }],
  exports: [APP_CONFIG],
})
export class AppConfigModule {}
