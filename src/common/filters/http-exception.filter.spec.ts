import { AllExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new AllExceptionFilter()).toBeDefined();
  });
});
