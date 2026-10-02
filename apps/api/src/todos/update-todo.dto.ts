import { Transform } from 'class-transformer';
import { IsBoolean, IsString, Matches, ValidateIf } from 'class-validator';

export class UpdateTodoDto {
  @ValidateIf((_object, value) => value !== undefined)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, {
    message: 'title must contain at least one non-whitespace character',
  })
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
