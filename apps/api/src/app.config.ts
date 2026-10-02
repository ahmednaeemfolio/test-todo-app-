import { Module, ValidationPipe, type INestApplication } from '@nestjs/common';

@Module({})
export class AppModule {}

/** Configure shared HTTP behavior for the unauthenticated todo API. */
export function configureApp(app: INestApplication): void {
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: 422
    })
  );
}
