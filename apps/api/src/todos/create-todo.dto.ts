import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @Transform(({ obj, key }) => {
    const title = obj[key];
    return typeof title === 'string' ? title.trim() : title;
  })
  @IsString()
  @IsNotEmpty()
  title!: string;
}
