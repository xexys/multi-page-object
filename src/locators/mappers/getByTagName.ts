import type {TestContext} from '../../contexts';
import type {PageElement} from '../../pageElements';
import type {RootElementMapper} from '../types';
import {createRootElementMapper} from './utils';

type TagNameLowerCase = keyof HTMLElementTagNameMap;

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const findElementIndex = (elems: Element[], tagNames: TagNameLowerCase[]): number => {
    const tagNameSet = new Set<string>(tagNames);

    return elems.findIndex(({tagName}) => tagNameSet.has(tagName.toLowerCase()));
};

/**
 * Маппер для поиска элементов по названию тега.
 *
 * @param tagNames - Список тегов для поиска.
 *
 * @example
 *  class FooPO extends MultiPageObject {
 *      static rootSelector = '.foo';
 *
 *      // Это равносильно поиску по селектору '.foo input, .foo textarea'.
 *      // Такие селекторы, при описании классов PageObject, мы не используем, так как их сложно конкатенировать
 *      // не нарушая принципа их работы.
 *      get textField() {
 *          return this._getPageObject<HTMLInputElement | HTMLTextAreaElement>(getByTagName('input', 'textarea'))
 *      }
 *  }
 *
 */
export const getByTagName = (...tagNames: TagNameLowerCase[]): RootElementMapper => {
    const getByTagNameMapper = async ({browser}: TestContext, elems: PageElement[]) => {
        const index = await browser.execute(findElementIndex, elems, tagNames);

        return elems[index];
    };

    return createRootElementMapper(getByTagNameMapper, {tagNames});
};
