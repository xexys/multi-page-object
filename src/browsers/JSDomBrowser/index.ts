import type {PageElement} from '../../pageElements';
import {assertSelector, JSDomPageElement} from '../../pageElements';
import {BaseBrowser} from '../BaseBrowser';

export class JSDomBrowser extends BaseBrowser {
    async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
        assertSelector(selector);

        const value = document.querySelector<E>(selector);

        return value ? new JSDomPageElement({value, selector}) : null;
    }

    async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
        assertSelector(selector);

        const values = document.querySelectorAll<E>(selector);

        return Array.from(values, value => new JSDomPageElement({value, selector}));
    }

    protected async _executeCallback<P extends unknown[], R>(fn: (...args: P) => R, ...args: P): Promise<R> {
        return fn(...args);
    }
}
