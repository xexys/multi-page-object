import {JSDomBrowser} from '../../browsers';
import type {TestReporter} from '../../reporters';
import {TestContext} from '../TestContext';

type TestamentReporterStep = typeof step;

const createReport = (reporterStep: TestamentReporterStep): TestReporter => ({
    async runStep(name, fn) {
        return reporterStep(name, fn);
    },
});

type Params = {
    testamentReporterStep: TestamentReporterStep;
};

export class TestamentTestContext extends TestContext {
    constructor({testamentReporterStep}: Params) {
        const browser = new JSDomBrowser();

        const reporter = createReport(testamentReporterStep);

        const options = {
            waitForTimeout: 2000,
            waitForInterval: 50,
        };

        super({browser, reporter, options});
    }
}
