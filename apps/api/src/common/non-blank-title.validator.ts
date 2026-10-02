import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNonBlankTitle', async: false })
class NonBlankTitleConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  defaultMessage(): string {
    return 'title must contain at least one non-whitespace character';
  }
}

/** Validates that a title contains at least one non-whitespace character. */
export function IsNonBlankTitle(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    registerDecorator({
      name: 'isNonBlankTitle',
      target: target.constructor,
      propertyName: propertyKey.toString(),
      options: validationOptions,
      validator: NonBlankTitleConstraint,
    });
  };
}
