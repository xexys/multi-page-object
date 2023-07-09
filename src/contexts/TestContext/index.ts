import type {TestBrowser} from '../../browsers';
import type {TestReporter} from '../../reporters';

export type TestContextOptions = {
    waitForTimeout: number;
    waitForInterval: number;
};

type Params = {
    browser: TestBrowser;
    reporter: TestReporter;
    options: TestContextOptions;
};

export abstract class TestContext {
    public browser: TestBrowser;

    public reporter: TestReporter;

    public options: TestContextOptions;

    protected constructor(params: Params) {
        this.browser = params.browser;
        this.reporter = params.reporter;
        this.options = params.options;
    }

    step<T>(name: string, fn: () => T | Promise<T>): Promise<T> {
        return this.reporter.runStep(name, fn);
    }
}
