import assert from 'assert';

import type {WebdriverIOElementPromise} from '../browsers';
import {WebdriverIOBrowser} from '../browsers';
import {assertSelector, JSDomPageElement, WebdriverIOPageElement} from '../pageElements';
import type {MultiPageObject} from '../pageObjects';

export const toDOMElement = async <E extends Element, T extends MultiPageObject<E>>(multiPO: T): Promise<E> => {
    const root = await multiPO.rootElement;

    assert(root instanceof JSDomPageElement, 'You can use this method only in JSDOM environment!');

    return root.value;
};

export const toWebElementPromise = (multiPO: MultiPageObject<Element>): WebdriverIOElementPromise => {
    const message = 'You can use this method only in WebdriverIO environment!';

    const {browser} = multiPO.context;
    assert(browser instanceof WebdriverIOBrowser, message);

    return multiPO.rootElement.then(rootElement => {
        assert(rootElement instanceof WebdriverIOPageElement, message);

        return rootElement.toWebElementPromise();
    })
}

