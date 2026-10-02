import { validate } from 'class-validator';
import { IsNonBlankTitle } from './non-blank-title.validator';

class TitleDto {
  @IsNonBlankTitle()
  title!: string;
}

describe('IsNonBlankTitle', () => {
  it.each(['A title', ' title ', 'x'])('accepts a non-blank title: %j', async (title) => {
    const dto = new TitleDto();
    dto.title = title;

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it.each(['', ' ', '   ', '\t', '\n', ' \t\n '])('rejects a blank title: %j', async (title) => {
    const dto = new TitleDto();
    dto.title = title;

    await expect(validate(dto)).resolves.toHaveLength(1);
  });
});
