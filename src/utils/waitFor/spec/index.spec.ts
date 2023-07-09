/**
 * 1 - Вызывает ф-ию несколько раз, для проверки наличия какой-то логики внутри ф-ии,
 *     которая работает синхронно, но например зависит от значения в замыкании.
 */

import {UnitTestContext} from 'spec/multiPageObject';

import {waitFor, waitForNot} from '../index';

const truthyValues = [true, 'false', 123, '0', {}];
const falsyValues = [false, '', 0, null, undefined, NaN];
const timeoutMessage = 'timeout';
const timeoutError = new Error(timeoutMessage);

const context = new UnitTestContext();

describe('waitFor', () => {
    describe('resolves', () => {
        it.each(truthyValues)('если condition ф-ия вернула асинхронное truthy значение: %p', async value => {
            const result = waitFor(context, async () => value, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).resolves.toBe(true);
        });

        it.each(truthyValues)('если condition ф-ия вернула синхронное truthy значение: %p', async value => {
            const condition = jest.fn(() => value);
            const result = waitFor(context, condition);

            await expect(result).resolves.toBe(true);
            await expect(condition).toHaveBeenCalledTimes(1);
        });
    });

    describe('rejects', () => {
        it.each(falsyValues)('если condition ф-ия вернула асинхронное falsy значение: %p', async value => {
            const result = waitFor(context, async () => value, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError('waitFor condition timed out after 500ms');
        });

        it.each(falsyValues)('если condition ф-ия вернула синхронное falsy значение: %p', async value => {
            const condition = jest.fn(() => value);
            const result = waitFor(context, condition, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError(
                'waitFor condition failed with the following reason: return value was never truthy',
            );

            await expect(condition).toHaveBeenCalledTimes(3); // 1
        });

        it('если condition ф-ия вернула rejected promise с пустым сообщением об ошибке', async () => {
            const result = waitFor(context, () => Promise.reject(new Error()), {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError('waitFor condition failed with the following reason: Error');
        });

        it('если condition ф-ия вернула rejected promise с сообщением об ошибке', async () => {
            const result = waitFor(context, () => Promise.reject(new Error('foo')), {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError('waitFor condition failed with the following reason: foo');
        });

        it('с кастомным сообщением об ошибке при наступлении таймаута', async () => {
            const result = waitFor(context, async () => false, {
                error: timeoutMessage,
            });

            await expect(result).rejects.toThrowError(timeoutMessage);
        });

        it('с кастомным объектом ошибки при наступлении таймаута', async () => {
            const result = waitFor(context, async () => false, {
                error: timeoutError,
            });

            await expect(result).rejects.toBe(timeoutError);
        });
    });

    it('Выбрасывает исключение, если condition ф-ия синхронная, и в ней возникло исключение', () => {
        const error = new Error('error');

        expect(() =>
            waitFor(context, () => {
                throw error;
            }),
        ).toThrowError(error);
    });

    it('Должна использовать дефолтные настройки для timeout значения', async () => {
        const result = waitFor(context, async () => false, {
            interval: 500,
        });

        await expect(result).rejects.toThrowError('waitFor condition timed out after 1000ms');
    });

    it('Должна использовать дефолтные настройки для interval значения', async () => {
        const condition = jest.fn(async () => false);
        const result = waitFor(context, condition, {
            timeout: 240,
        });

        await expect(result).rejects.toThrowError('waitFor condition timed out after 240ms');
        await expect(condition).toHaveBeenCalledTimes(5);
    });
});

describe('waitForNot', () => {
    describe('resolves', () => {
        it.each(falsyValues)('если condition ф-ия вернула асинхронное falsy значение: %p', async value => {
            const result = waitForNot(context, async () => value, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).resolves.toBe(true);
        });

        it.each(falsyValues)('если condition ф-ия вернула синхронное falsy значение: %p', async value => {
            const condition = jest.fn(() => value);
            const result = waitForNot(context, condition);

            await expect(result).resolves.toBe(true);
            await expect(condition).toHaveBeenCalledTimes(1);
        });
    });

    describe('rejects', () => {
        it.each(truthyValues)('если condition ф-ия вернула асинхронное truthy значение: %p', async value => {
            const result = waitForNot(context, async () => value, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError('waitFor condition timed out after 500ms');
        });

        it.each(truthyValues)('если condition ф-ия вернула синхронное truthy значение: %p', async value => {
            const condition = jest.fn(() => value);
            const result = waitForNot(context, condition, {
                timeout: 500,
                interval: 200,
            });

            await expect(result).rejects.toThrowError(
                'waitFor condition failed with the following reason: return value was never truthy',
            );

            await expect(condition).toHaveBeenCalledTimes(3); // 1
        });
    });
});
