import assert from 'assert';

import type {PageElement} from '../../pageElements';
import type {ExecuteCallback, SerializeData} from '../TestBrowser';
import {TestBrowser} from '../TestBrowser';
import {prepareExecuteCallbackArgs} from './utils';

export abstract class BaseBrowser extends TestBrowser {
    async $get<E extends Element>(selector: string): Promise<PageElement<E>> {
        const elem = await this.$<E>(selector);

        assert(elem, `Element by selector '${selector}' not found (⊙ _ ⊙ )!`);

        return elem;
    }

    public execute<P extends unknown[], R>(fn: ExecuteCallback<P, R>, ...args: P): Promise<SerializeData<R>> {
        return this._executeCallback(fn, ...prepareExecuteCallbackArgs(args));
    }

    protected abstract _executeCallback(fn: (...args: any) => any, ...args: any[]): any;
}
