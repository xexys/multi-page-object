import assert from 'assert';


import {WebdriverIOBrowser} from '../../browsers';
import type {WebdriverIOBrowserAPI} from '../../browsers';
import {AllureReporter} from '../../reporters';
import {TestContext} from '../TestContext';

type Params = {
    browser: WebdriverIOBrowserAPI;
};

export class HermioneTestContext extends TestContext {
    constructor(params: Params) {
        const wdioBrowser = params.browser;
        const allure = wdioBrowser.allure;

        const browser = new WebdriverIOBrowser(wdioBrowser);

        const reporter = new AllureReporter(allure);

        /**
         * Актуальное значение для таймаута будет выставлено согласно настройкам окружения, в котором выполняются тесты.
         * @see https://github.com/gemini-testing/hermione/tree/v3.13.0#waittimeout
         *
         * Как минимум, должно быть дефолтное значение, выставляемое WebdriverIO.
         * @see https://github.com/webdriverio/webdriverio/blob/v4.13.2/lib/webdriverio.js#L44-L45
         */
        const waitForTimeout = wdioBrowser.options.waitforTimeout;
        assert(waitForTimeout, 'Value of waitForTimeout must be defined!');

        /**
         * В качестве значения интервала будет использовано дефолтное значение WebdriverIO,
         * так как в Hermione оно никак специально не настраивается.
         * @see https://github.com/webdriverio/webdriverio/blob/v4.13.2/lib/webdriverio.js#L44-L45
         */
        const waitForInterval = wdioBrowser.options.waitforInterval;
        assert(waitForInterval, 'Value of waitForInterval must be defined!');

        const options = {waitForTimeout, waitForInterval};

        super({browser, reporter, options});
    }
}
