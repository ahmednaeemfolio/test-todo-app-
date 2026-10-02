import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

export class CreateTodoDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Matches(/\S/, {
    message: 'title must contain at least one non-whitespace character',
  })
  title!: string;
}
