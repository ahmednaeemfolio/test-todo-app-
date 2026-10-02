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

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must contain at least one non-whitespace character`;
  }
}

/** Adds a class-validator rule for required, non-blank title fields. */
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
