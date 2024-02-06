import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';

describe('throttledGetDataFromApi', () => {
  const relativePath = '/posts/1';
  const baseURL = 'https://jsonplaceholder.typicode.com';

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');

    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axiosCreateSpy).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest.fn(() => ({ data: 'Test' }));

    jest.spyOn(axios, 'create').mockReturnValue({
      get: axiosGetSpy,
    } as unknown as AxiosInstance);

    await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(axiosGetSpy).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const axiosGetSpy = jest.fn(() => ({ data: 'Test' }));

    jest.spyOn(axios, 'create').mockReturnValue({
      get: axiosGetSpy,
    } as unknown as AxiosInstance);

    const result = await throttledGetDataFromApi(relativePath);
    jest.advanceTimersByTime(THROTTLE_TIME);

    expect(result).toBe('Test');
  });
});
