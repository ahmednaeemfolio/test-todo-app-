import { ValidateIf, IsBoolean, IsString, Matches } from 'class-validator';

export class UpdateTodoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'title must not be empty or whitespace-only' })
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
