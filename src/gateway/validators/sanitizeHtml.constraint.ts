import { registerDecorator, ValidationOptions } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

export function SanitizeHtml(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'sanitizeHtml',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const sanitizedValue = sanitizeHtml(value);
          return sanitizedValue === value;
        }
      }
    });
  };
}
