import { ChainablePromiseElement } from 'webdriverio';

import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
export class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get inputUsername () {
        return this._getPageObject('#username')
    }

    public get inputPassword () {
        return this._getPageObject('#password');
    }

    public get btnSubmit () {
        return this._getPageObject('button[type="submit"]');
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    public async login (username: string, password: string) {
        await (await this.inputUsername.rootElement).typeValue(username);
        await (await this.inputPassword.rootElement).typeValue(password);
        await this.btnSubmit.click();
    }

    /**
     * overwrite specific options to adapt it to page object
     */
    public open () {
        return super.open('login');
    }
}
