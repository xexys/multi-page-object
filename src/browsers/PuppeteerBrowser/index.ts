/**
 * @see https://pptr.dev/api/puppeteer.puppeteernode
 */
import type {
    Browser,
    EvaluateFn,
    EvaluateFnReturnType,
    SerializableOrJSHandle,
    Page,
    UnwrapPromiseLike,
} from 'puppeteer';

import type {PageElement} from '../../pageElements';
import {assertSelector, PuppeteerPageElement} from '../../pageElements';
import {BaseBrowser} from '../BaseBrowser';

export class PuppeteerBrowser extends BaseBrowser {
    private readonly _browser: Browser;
    private readonly _page: Page;

    constructor(page: Page) {
        super();

        this._page = page;
        this._browser = page.browser();
    }

    async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
        assertSelector(selector);

        const value = await this._page.$<E>(selector);

        return value ? new PuppeteerPageElement({value, selector}) : null;
    }

    async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
        assertSelector(selector);

        const values = await this._page.$$<E>(selector);

        return values.map(value => new PuppeteerPageElement({value, selector}));
    }

    protected async _executeCallback<P extends SerializableOrJSHandle[], F extends EvaluateFn<P>>(
        fn: F,
        ...args: P
    ): Promise<UnwrapPromiseLike<EvaluateFnReturnType<F>>> {
        return this._page.evaluate(fn, ...args);
    }
}
