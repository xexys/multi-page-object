import type {TestReporter} from './types';

export class DummyReporter implements TestReporter {
    async runStep<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
        return fn();
    }
}
