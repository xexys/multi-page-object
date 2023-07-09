import assert from 'assert';

import type {Browser} from '@yandex-market/ginny';

import {WebdriverIOBrowser} from '../../browsers';
import type {WebdriverIOBrowserAPI} from '../../browsers';
import {AllureReporter} from '../../reporters';
import {TestContext} from '../TestContext';

type Params = {
    browser: Browser;
};

export class HermioneTestContext extends TestContext {
    constructor(params: Params) {
        const wdioBrowser = params.browser as WebdriverIOBrowserAPI & Browser;
        const allure = wdioBrowser.allure;

        const browser = new WebdriverIOBrowser(wdioBrowser);

        const reporter = new AllureReporter(allure);

        /**
         * Актуальное значение для таймаута будет выставлено согласно настройкам окружения, в котором выполняются тесты.
         * @see https://github.com/gemini-testing/hermione/tree/v3.13.0#waittimeout
         * @see https://a.yandex-team.ru/arcadia/market/front/apps/partner/configs/ginny/partner.common/.hermione.conf.js?rev=r11075249#L32
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
