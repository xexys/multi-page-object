import assert from 'assert';

import {TestBrowser} from '../browsers';

import type {SearchPageElement, PageElement} from './PageElement';
import {JSDomPageElement} from './JSDomPageElement';
import {WebdriverIOPageElement} from './WebdriverIOPageElement';

/**
 * Вообще null является валидным селектором, по которому document.querySelector вернет null.
 * Но различные библиотеки по-разному это обрабатывают. Например, WebdriverIO возвращает html элемент.
 * На всякий случай дополнительно страхуемся от таких сюрпризов. Запрещаем null на уровне типов
 * и кидаем ошибку в рантайме, если селектор пустой.
 */
export function assertSelector(selector: string): asserts selector is string {
    assert(selector, `CSS selector '${selector}' must not be empty!`);
}

export const isPageElementMatchWithSelector = async (elem: PageElement, selector: string): Promise<boolean> => {
    return elem.matches(selector);
};

export const toObjectString = (value: unknown): string => {
    return Object.prototype.toString.call(value);
};

/**
 * Возвращает строковое представление для объектов, реализующих интерфейс SearchPageElement.
 *
 * @example
 *  '[object JSDomBrowser]'
 *  '[object WebdriverIOBrowser]'
 *
 * @example
 *  'HTMLHtmlElement(<html></html>)'
 *  'HTMLDivElement(<div class="foo"></div>)'
 *  'HTMLAnchorElement(<a href="https://yandex.ru"></a>)'
 *
 * @example
 *  '{"selector":"div > span[role=\\"button\\"]", "value": {"ELEMENT": "0.9185432174242962-3"}}'
 *  '{"selector":"div span", "value": {"ELEMENT": "0.9185432174242962-3", "element-6066-11e4-a52e-4f735466cecf": "0.9185432174242962-3"}}'
 */
export const searchPageElementToString = (elem: SearchPageElement) => {
    if (elem instanceof TestBrowser) {
        return `[object ${elem.constructor.name}]`;
    }

    if (elem instanceof WebdriverIOPageElement) {
        return JSON.stringify({
            selector: elem.selector,
            value: elem.value,
        });
    }

    if (elem instanceof JSDomPageElement) {
        const elemHtml = elem.value.cloneNode(false).outerHTML;
        const elemObjectString = toObjectString(elem.value);
        const elemType = elemObjectString.match(/^\[object (\w+)]$/)?.[1];

        return `${elemType}(${elemHtml})`;
    }

    return assert.fail(`Unknown SearchPageElement(${toObjectString(elem)})!`);
};
