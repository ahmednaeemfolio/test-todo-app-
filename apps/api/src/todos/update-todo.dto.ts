import { IsBoolean, IsString, Matches, ValidateIf } from 'class-validator';

/** Fields that may be independently changed on a todo. */
export class UpdateTodoDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'title must not be empty or whitespace-only' })
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
