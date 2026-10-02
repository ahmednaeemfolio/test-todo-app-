import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { appConfig } from './app.config';

async function bootstrap(): Promise<void> {
  // AppModule is supplied by the API integration layer.
  const appModulePath = './app.module';
  const { AppModule } = await import(appModulePath);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(appConfig.port);
}

void bootstrap();
