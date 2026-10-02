import { IsBoolean, IsString, ValidateIf } from "class-validator";

/**
 * Partial update payload. Missing properties are allowed; values that are
 * supplied must have the correct type. The service applies title trimming and
 * the 400 response for an empty-after-trimming title.
 */
export class UpdateTodoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
