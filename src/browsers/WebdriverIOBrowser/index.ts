/**
 * @see http://v4.webdriver.io/api.html
 */

import type {PageElement} from '../../pageElements';
import {assertSelector, WebdriverIOPageElement} from '../../pageElements';
import type {CreateElementPromiseCallback, WebdriverIOBrowserAPI, WebdriverIOElementPromise} from './types';
import {BaseBrowser} from '../BaseBrowser';

export type {WebdriverIOBrowserAPI, WebdriverIOElementPromise};

export class WebdriverIOBrowser extends BaseBrowser {
    private readonly _browser: WebdriverIOBrowserAPI;

    constructor(browser: WebdriverIOBrowserAPI) {
        super();

        this._browser = browser;
    }

    async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
        assertSelector(selector);

        const promise = this._browser.$(selector);
        const value = await promise;

        return !value.error ? new WebdriverIOPageElement(this, {promise, value, selector}) : null;
    }

    async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
        assertSelector(selector);

        // Похоже, что в декларации с типами для WebdriverIO ошибка,
        // так как мы получаем не массив промисов, а промис, содержащий массив.
        // Потому описываем тип вручную, и не забываем await!
        const values: Array<WebdriverIO.RawResult<WebdriverIO.Element>> = await this._browser.$$(selector);

        return values.map(({value}) => new WebdriverIOPageElement(this, {value, selector}));
    }

    createElementPromise(callback: CreateElementPromiseCallback): WebdriverIOElementPromise {
        return this._browser.$('*').then(callback) as WebdriverIOElementPromise;
    }

    async sendKeys(keys: string | string[]): Promise<void> {
        await this._browser.keys(keys);
    }

    async uploadFile(path: string): Promise<WebdriverIO.RawResult<string>> {
        return this._browser.uploadFile(path);
    }

    /**
     * Корректно сериализует/десериализует значения аргументов
     * (WebdriverIO.Element в Element и обратно) при выполнении callback ф-ии.
     */
    protected async _executeCallback<P extends unknown[], R>(fn: (...args: P) => R, ...args: P): Promise<R> {
        const script = `
            const args = Array.from(arguments); 
            const params = args.slice(0, args.length - 1);
            const done = args[args.length - 1];
            return Promise.resolve((${fn}).apply(null, params)).then(done);
        `;

        return  this._browser.executeAsync(script, ...args);
    }
}
