import type {TestReporter} from './types';

export type AllureReporterType = {
    runStep<T>(name: string, fn: () => T): T;
    runStep<T>(name: string, fn: () => Promise<T>): Promise<T>;
};

export class AllureReporter implements TestReporter {
    private _allure: AllureReporterType;

    constructor(allure: AllureReporterType) {
        this._allure = allure;
    }

    async runStep<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
        return this._allure.runStep(name, fn);
    }
}
