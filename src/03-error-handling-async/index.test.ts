import {
  throwError,
  throwCustomError,
  resolveValue,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    expect(resolveValue('test')).resolves.toBe('test');
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const testThrowError = () => throwError('test');

    expect(testThrowError).toThrowError('test');
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrowError('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrowError('This is my awesome custom error!');
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    expect(rejectCustomError).rejects.toThrowError(
      'This is my awesome custom error!',
    );
  });
});
