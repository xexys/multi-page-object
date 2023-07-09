import type {TestContext} from '../../contexts';
import type {PageElement} from '../../pageElements';
import type {RootElementIndex, RootElementMapper} from '../types';
import {createRootElementMapper} from './utils';

/**
 * Маппер для поиска элемента по его индексу в списке найденных.
 * Это тестовый маппер, вместо него лучше использовать АПИ для поиска элементов через явное указание индекса.
 *
 * @param index  - Индекс элемента для поиска, начинается с 0.
 *
 * @example
 *  class BarPO extends MultiPageObject {
 *      static rootSelector = '.bar';
 *  }
 *
 *  class FooPO extends MultiPageObject {
 *      static rootSelector = '.foo';
 *
 *      // Только для примера.
 *      // Это равносильно jQuery селектору '.foo .bar:eq(0)'.
 *      get getBarByIndex(index: number) {
 *          return this._getPageObject(BarPO, getByIndex(index));
 *      }
 *
 *      // Это лучший вариант!
 *      get getBarByIndex(index: number) {
 *          return this._getPageObject(BarPO, index);
 *      }
 *  }
 */
export const getByIndex = (index: RootElementIndex): RootElementMapper => {
    const getByIndexMapper = (context: TestContext, elems: PageElement[]) => elems[index];

    return createRootElementMapper(getByIndexMapper, {index});
};
