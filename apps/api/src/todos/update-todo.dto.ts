import { IsBoolean, IsString, ValidateIf } from "class-validator";

/** Fields that may be changed independently on an existing todo. */
export class UpdateTodoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
