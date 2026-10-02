import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isNonBlankTitle', async: false })
export class NonBlankTitleConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  defaultMessage(arguments_: ValidationArguments): string {
    return `${arguments_.property} must contain at least one non-whitespace character`;
  }
}

/** Ensures a title contains at least one non-whitespace character. */
export function IsNonBlankTitle(validationOptions?: ValidationOptions) {
  return (target: object, propertyName: string): void => {
    registerDecorator({
      name: 'isNonBlankTitle',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: NonBlankTitleConstraint,
    });
  };
}
