/**
 * 1 - Magic!
 *     В качестве параметра передаем элемент в его JSON представлении, но на клиенте получаем реальный DOM элемент :)
 *     {ELEMENT: '0.9185432174242962-3', 'element-6066-11e4-a52e-4f735466cecf': '0.9185432174242962-3'}
 *     @see http://v4.webdriver.io/api/protocol/executeAsync.html
 *
 * @see http://v4.webdriver.io/api.html
 */
import assert from 'assert';

import type {WebdriverIOBrowser, WebdriverIOElementPromise} from '../../browsers';
import type {PageElement, SetValueOptions} from '../PageElement';
import {assertSelector} from '../utils';
import {BasePageElement} from '../BasePageElement';
import {browser} from "@wdio/globals";

/**
 * @see https://w3c.github.io/webdriver/#elements
 */
const W3C_ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf';

export type WebdriverIOPageElementValue = WebdriverIO.Element & {
    'element-6066-11e4-a52e-4f735466cecf'?: WebdriverIO.ElementId;
};

type Params = {
    promise: ChainablePromiseElement;
    value: WebdriverIOPageElementValue;
    selector: string;
};

export class WebdriverIOPageElement<T extends Element> extends BasePageElement<T, WebdriverIOPageElementValue> {
    private readonly _browser: WebdriverIOBrowser;
    private readonly _elem: WebdriverIOElementPromise;

    constructor(browser: WebdriverIOBrowser, {promise, value, selector}: Params) {
        super({value, selector});

        this._browser = browser;
        // this._elem = browser.createElementPromise(() => ({value, selector}));
        this._elem = promise;
    }

    toWebElementPromise() {
        return this._elem;
    }

    async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
        assertSelector(selector);

        const value = await this._elem.$(selector);

        return !value.error ? new WebdriverIOPageElement(this._browser, {value, selector}) : null;
    }

    async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
        assertSelector(selector);

        // Похоже, что в декларации с типами для WebdriverIO ошибка,
        // так как мы получаем не массив промисов, а промис, содержащий массив.
        // Потому описываем тип вручную, и не забываем await!
        const values: Array<WebdriverIO.RawResult<WebdriverIO.Element>> = await this._elem.$$(selector);

        return values.map(({value}) => new WebdriverIOPageElement(this._browser, {value, selector}));
    }

    public async click(): Promise<void> {
        await this._elem.click();
    }

    public async dblClick(): Promise<void> {
        await this._elem.doubleClick();
    }

    public async outsideClick(): Promise<void> {
        await this._elem.leftClick(-10, -10);
    }

    public async getTextContent(): Promise<string | null> {
        /**
         * Используем execute, потому что нативный метод webdriverio getText на самом деле возвращает innerText.
         * @see http://v4.webdriver.io/api/property/getText.html
         * @see https://stackoverflow.com/questions/35213147/difference-between-textcontent-vs-innertext
         */
        return this._browser.execute(elem => elem.textContent, this as PageElement);
    }

    public async getAttribute(name: string): Promise<string | null> {
        return this._elem.getAttribute<string | null>(name);
    }

    public async hasAttribute(name: string): Promise<boolean> {
        const attribute = await this._elem.getAttribute<string | null>(name);

        return attribute !== null;
    }

    public async getProperty<K extends keyof T>(name: K): Promise<T[K]> {
        // Пока не удалось сделать сериализацию/десериализацию типов с поддержкой дженериков для execute ф-ии.
        // Потому, по сути, мы сейчас говорим, что будем получать все значения для всех ключей Element,
        // и дальше кастуем результат в T[K].
        const value = await this._browser.execute(getProperty, this as PageElement, name as keyof Element); // 1

        return value as T[K];
    }

    public async getTagName(): Promise<string> {
        return this._elem.getTagName();
    }

    public async getValue(): Promise<string> {
        return this._elem.getValue();
    }

    public async typeValue(value: string | number, {mode = 'replace'}: SetValueOptions = {}): Promise<void> {
        await browser.elementClick(this._getElementId());
        // await this._elem.click();

        if (mode === 'replace') {
            await this._setSelectionAll();

            if (value === '') {
                await this._browser.sendKeys(['Backspace']);
                return;
            }
        }

        console.log('FFF')

        await this._elem.elementSendKeys(this._getElementId(), String(value));
    }

    public async pasteValue(value: string | number, {mode = 'replace'}: SetValueOptions = {}): Promise<void> {
        await this._elem.click();

        if (mode === 'replace') {
            await this._setSelectionAll();

            if (value === '') {
                await this._browser.sendKeys(['Backspace']);
                return;
            }
        }

        await this._browser.execute((text: string) => navigator.clipboard.writeText(text), String(value));
        await this._browser.sendKeys(['Control', 'A', 'Control', 'Shift', 'Insert', 'Shift', 'ArrowRight']);
    }

    public async isExisting(): Promise<boolean> {
        return this._elem.isExisting();
    }

    public async isVisible(): Promise<boolean> {
        return this._elem.isVisible();
    }

    public async matches(selector: string): Promise<boolean> {
        return this._browser.execute(matches, this as PageElement, selector); // 1
    }

    public async hover(): Promise<void> {
        await this._elem.moveToObject();
    }

    public async unhover(): Promise<void> {
        await this._elem.moveTo(-10, -10);
    }

    public async uploadFiles(...paths: string[]): Promise<void> {
        const uploadedPaths = await Promise.all(
            paths.map(path => {
                return this._browser.uploadFile(path).then(result => result.value);
            }),
        );

        await this._elem.addValue(uploadedPaths.join('\n'));
    }

    private _getElementId(): WebdriverIO.ElementId {
        // @see https://github.com/webdriverio/webdriverio/blob/v4.14.4/lib/protocol/element.js#L50-L54
        const elementId = this.value.ELEMENT || this.value[W3C_ELEMENT_ID];

        assert(elementId, 'WebdriverIO.ElementId must be defined!');

        return elementId;
    }

    private async _setSelectionAll(): Promise<void> {
        await this._browser.execute(setSelectionAll, this as PageElement); // 1
    }
}

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const getProperty = <T extends Element, K extends keyof T>(elem: T, key: K): T[K] => {
    return elem[key];
};

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const matches = async (elem: Element, selector: string): boolean => {
    return elem.matches(selector);
};

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const setSelectionAll = (elem: Element) => {
    if (!(elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement)) {
        const elemStr = Object.prototype.toString.call(elem);

        throw new Error(`Element '${elemStr}' must be instance of HTMLInputElement or HTMLTextAreaElement!`);
    }

    if (elem.value.length) {
        elem.setSelectionRange(0, elem.value.length);
    }
};
