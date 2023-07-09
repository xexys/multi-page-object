import { browser, $, $$ } from '@wdio/globals'
import {LoginPage} from '../pageobjects/login.page'
import {SecurePage} from '../pageobjects/secure.page'
import {E2ETestContext, setGlobalTestContext} from "../../src";

Object.assign(browser, {$, $$});
const context = new E2ETestContext(browser);

setGlobalTestContext(context);

const loginPage = new LoginPage();
const securePage = new SecurePage();

describe('My Login application', () => {
    it('should login with valid credentials', async () => {

        await loginPage.open()

        await loginPage.login('tomsmith', 'SuperSecretPassword!')
        await expect(securePage.flashAlert.toWebElementPromise()).resolves.toBeExisting()
        await expect(securePage.flashAlert.toWebElementPromise()).resolves.toHaveTextContaining(
            'You logged into a secure area!')
    })
})


