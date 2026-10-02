import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppConfigModule, appConfig } from './app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppConfigModule);
  app.enableShutdownHooks();
  await app.listen(appConfig.port);
}

void bootstrap();
