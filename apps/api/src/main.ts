import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { appConfig } from './app.config';

/**
 * Empty bootstrap module keeps the API executable while feature modules are
 * added and wired into the root module by their owning tasks.
 */
@Module({})
class BootstrapModule {}

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(BootstrapModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      errorHttpStatusCode: 422,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(appConfig.port);
}

if (require.main === module) {
  void bootstrap();
}
