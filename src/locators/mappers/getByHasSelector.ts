import type {TestContext} from '../../contexts';
import type {PageElement} from '../../pageElements';
import type {RootElementMapper} from '../types';
import {createRootElementMapper} from './utils';

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const findElementIndex = (elems: Element[], selector: string): number => {
    return elems.findIndex(elem => elem.querySelector(selector));
};

/**
 * Маппер для поиска первого элемента, внутри которого есть другой элемент, содержащий указанный селектор.
 * По сути это аналог ':has' селекторов, которые еще только начинают поддерживаться браузерами.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:has
 * @see https://caniuse.com/css-has
 *
 * @example
 *  class ButtonPO extends MultiPageObject {
 *      static rootSelector = 'button';
 *  }
 *
 *  class Foo extends MultiPageObject {
 *      static rootSelector = '.foo';
 *
 *      // Это равносильно поиску по селектору '.foo button:has(.someClass)'
 *      get cancelButton() {
 *          return this._getPageObject(ButtonPO, getByHasSelector('.someClass'))
 *      }
 *  }
 */
export const getByHasSelector = (selector: string): RootElementMapper => {
    const getByHasSelectorMapper = async ({browser}: TestContext, elems: PageElement[]) => {
        const index = await browser.execute(findElementIndex, elems, selector);

        return elems[index];
    };

    return createRootElementMapper(getByHasSelectorMapper, {selector});
};
