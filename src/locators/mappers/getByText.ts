import type {TestContext} from '../../contexts';
import type {PageElement} from '../../pageElements';
import type {RootElementMapper} from '../types';
import {createRootElementMapper} from './utils';

// Данная ф-ия выполняется на стороне браузера, и не должна иметь внешних зависимостей.
const findElementIndex = (elems: Element[], reSource: string, reFlags: string): number => {
    const regExp = new RegExp(reSource, reFlags);

    return elems.findIndex(({textContent}) => textContent?.match(regExp));
};

/**
 * Маппер для поиска элементов по тексту или по регулярному выражению.
 * Регулярное выражение применяется к текстовому содержимому элемента.
 *
 * @example
 *  <ul>
 *      <li class="color">Red</li>
 *      <li class="color">Green</li>
 *      <li class="color">Blue</li>
 *  </ul>
 *
 *  class ColorPO extends MultiPageObject {
 *      static rootSelector = '.color';
 *  }
 *
 *  const red = new ColorPO(getByText('Red'));
 *  const green = new ColorPO(getByText(/green/i));
 */
export const getByText = (regExp: string | RegExp): RootElementMapper => {
    const re = typeof regExp === 'string' ? new RegExp(regExp) : regExp;

    const getByTextMapper = async ({browser}: TestContext, elems: PageElement[]) => {
        const index = await browser.execute(findElementIndex, elems, re.source, re.flags);

        return elems[index];
    };

    return createRootElementMapper(getByTextMapper, {regExp});
};
