import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class CreateTodoDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  title!: string;
}
