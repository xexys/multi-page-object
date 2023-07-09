import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get flashAlert () {
        return this._getPageObject('#flash');
    }
}
