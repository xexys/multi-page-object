import type {TestContext} from 'spec/multiPageObject';

import {Timer, TIMEOUT_ERROR} from './Timer';

export type WaitForOptions = Partial<{
    timeout: number;
    interval: number;
    error: Error | string;
}>;

const isThenable = <T>(value: Promise<T> | T): value is Promise<T> => {
    return typeof (value as Promise<T>)?.then === 'function';
};

export class WaitError extends Error {}

export const waitFor = <T>(
    context: TestContext,
    condition: () => T | Promise<T>,
    options: WaitForOptions = {},
): Promise<true> => {
    const {waitForTimeout, waitForInterval} = context.options;
    const {timeout = waitForTimeout, interval = waitForInterval, error} = options;

    const timer = new Timer(interval, timeout, condition, true);

    return (timer as any)
        .then((value: T) => Boolean(value))
        .catch((cause: Error) => {
            if (cause.message === TIMEOUT_ERROR) {
                if (error instanceof Error) {
                    throw error;
                }

                if (typeof error === 'string') {
                    throw new WaitError(error);
                }

                throw new WaitError(`waitFor condition timed out after ${timeout}ms`);
            }

            throw new Error(`waitFor condition failed with the following reason: ${(cause && cause.message) || cause}`);
        });
};

export const waitForNot = <T>(
    context: TestContext,
    condition: () => T | Promise<T>,
    options: WaitForOptions = {},
): Promise<true> => {
    return waitFor(
        context,
        () => {
            const result = condition();

            return isThenable(result) ? result.then(value => !value) : !result;
        },
        options,
    );
};
