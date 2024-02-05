import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

import path from 'path';
import fsPromise from 'fs/promises';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', async () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 100);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 100;

    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(timeout - 1);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 100);

    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalled();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 100;

    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    for (let i = 1; i <= 10; i += 1) {
      jest.advanceTimersByTime(interval);

      expect(callback).toBeCalledTimes(i);
    }
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'test.txt';

  test('should call join with pathToFile', async () => {
    const joinWitnPath = jest.spyOn(path, 'join');
    await readFileAsynchronously(pathToFile);

    expect(joinWitnPath).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    expect(readFileAsynchronously('test')).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'File content!';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fsPromise, 'readFile')
      .mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
  });
});
