import { ValidateIf, IsBoolean, IsString } from 'class-validator';

/** Fields that may be independently changed on an existing todo. */
export class UpdateTodoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
