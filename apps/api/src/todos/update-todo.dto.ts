import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateTodoDto {
  @ValidateIf((object, value) => value !== undefined || object.completed === undefined)
  @IsDefined({ message: 'at least one todo field must be provided' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Matches(/\S/, { message: 'title must not be empty or whitespace-only' })
  title?: string;

  @ValidateIf((_object, value) => value !== undefined)
  @IsBoolean()
  completed?: boolean;
}
