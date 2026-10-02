import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CreateTodoDto {
  // Trimming before the service keeps persisted titles canonical; the service
  // rejects a resulting empty string with HTTP 400.
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  title!: string;
}
