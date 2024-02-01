import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  const BALANCE = 10;
  const bank = getBankAccount(BALANCE);

  test('should create account with initial balance', () => {
    expect(bank.getBalance()).toBe(BALANCE);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const testWithDraw = () => bank.withdraw(20);

    expect(testWithDraw).toThrowError(new InsufficientFundsError(BALANCE));
  });

  test('should throw error when transferring more than balance', () => {
    const testWithDraw = () => bank.transfer(20, getBankAccount(BALANCE));

    expect(testWithDraw).toThrowError(new InsufficientFundsError(BALANCE));
  });

  test('should throw error when transferring to the same account', () => {
    const testWithDraw = () => bank.transfer(20, bank);

    expect(testWithDraw).toThrowError(new TransferFailedError());
  });

  test('should deposit money', () => {
    bank.deposit(10);

    expect(bank.getBalance()).toBe(20);
  });

  test('should withdraw money', () => {
    bank.withdraw(10);

    expect(bank.getBalance()).toBe(10);
  });

  test('should transfer money', () => {
    bank.transfer(5, getBankAccount(BALANCE));

    expect(bank.getBalance()).toBe(5);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(10);

    expect(bank.fetchBalance()).resolves.toBe(10);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(20);
    await bank.synchronizeBalance();

    expect(bank.getBalance()).toBe(20);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(lodash, 'random').mockReturnValue(0);
    await expect(bank.synchronizeBalance()).rejects.toThrow(
      new SynchronizationFailedError(),
    );
  });
});
