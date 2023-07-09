import {JSDomBrowser} from '../../browsers';
import type {TestBrowser} from '../../browsers';
import {DummyReporter} from '../../reporters';
import type {TestReporter} from '../../reporters';
import {TestContext} from '../TestContext';

type Params = {
    browser?: TestBrowser;
    reporter?: TestReporter;
};

export class UnitTestContext extends TestContext {
    constructor(params: Params = {}) {
        const browser = params.browser ?? new JSDomBrowser();

        const reporter = params.reporter ?? new DummyReporter();

        const options = {
            waitForTimeout: 1000,
            waitForInterval: 50,
        };

        super({browser, reporter, options});
    }
}
