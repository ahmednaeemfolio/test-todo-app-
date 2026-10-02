import { Matches, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Matches(/\S/, {
    message: 'title must contain a non-whitespace character',
  })
  title!: string;
}
