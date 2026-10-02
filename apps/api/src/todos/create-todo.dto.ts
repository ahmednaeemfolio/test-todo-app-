import { IsString, Matches } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Matches(/\S/, {
    message: 'title must contain at least one non-whitespace character',
  })
  title!: string;
}
