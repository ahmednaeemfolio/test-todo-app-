import { Module } from "@nestjs/common";

/** Runtime settings shared by the API bootstrap and the rest of the application. */
export const appConfig = Object.freeze({
  host: process.env.HOST ?? "0.0.0.0",
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  databaseUrl: process.env.DATABASE_URL ?? "",
});

/** Root module placeholder; feature modules can be registered here as they are added. */
@Module({ imports: [], controllers: [], providers: [] })
export class AppModule {}
