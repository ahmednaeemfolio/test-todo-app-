import { validate } from 'class-validator';
import { IsNonBlankTitle } from './non-blank-title.validator';

class TitleDto {
  @IsNonBlankTitle()
  title!: string;
}

describe('IsNonBlankTitle', () => {
  it.each(['Todo', '  Todo  ', 'a'])('accepts a non-blank title: %j', async (title) => {
    const errors = await validate(Object.assign(new TitleDto(), { title }));

    expect(errors).toHaveLength(0);
  });

  it.each(['', ' ', '   ', '\t\n'])('rejects a blank title: %j', async (title) => {
    const errors = await validate(Object.assign(new TitleDto(), { title }));

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });
});
