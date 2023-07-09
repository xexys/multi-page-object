import {JSDomBrowser} from '../../browsers';
import {AllureReporter} from '../../reporters';
import type {AllureReporterType} from '../../reporters';
import {TestContext} from '../TestContext';

type Params = {
    allure: AllureReporterType;
};

export class CatTestContext extends TestContext {
    constructor({allure}: Params) {
        const browser = new JSDomBrowser();

        const reporter = new AllureReporter(allure);

        const options = {
            waitForTimeout: 2000,
            waitForInterval: 50,
        };

        super({browser, reporter, options});
    }
}
