import type {TestContext} from '../../../contexts';
import {
    RootElementNotFoundError,
    createGetElementByIndexLogMessage,
    createGetElementByMapperLogMessage,
    createGetElementByQuerySelectorLogMessage,
    createGetElementByQuerySelectorAllLogMessage,
} from '../../../errors';
import type {PageElement, SearchPageElement} from '../../../pageElements';
import type {Locator, RootElementIndex, RootElementSelector, RootElementMapper} from '../../../locators';

const createQuerySelector = (selectors: string[]): string => {
    return selectors.join(' ');
};

/**
 * Поиск root-элемента через переданный список локаторов.
 * Локаторы применяются последовательно к результату поиска предыдущего локатора.
 *
 * @see BasePageObject._getLocators
 */
export const searchRootElement = async (context: TestContext, locators: Locator[]): Promise<PageElement> => {
    const searchLog: string[] = [];

    const _searchRootElement = async (
        _locators: Array<RootElementIndex | RootElementSelector | RootElementMapper>,
        container: SearchPageElement,
    ): Promise<PageElement | null> => {
        const selectors = [];

        for (let i = 0; i < _locators.length; i++) {
            const locator = _locators[i];

            if (typeof locator === 'string') {
                selectors.push(locator.trim());
            } else {
                const query = createQuerySelector(selectors);
                const elems = await container.$$(query);

                searchLog.push(createGetElementByQuerySelectorAllLogMessage({container, query, result: elems}));

                let root: PageElement | null | undefined;

                if (typeof locator === 'number') {
                    root = elems[locator];
                    searchLog.push(createGetElementByIndexLogMessage({index: locator, result: root}));
                } else {
                    root = await locator(context, elems);
                    searchLog.push(createGetElementByMapperLogMessage({mapper: locator, result: root}));
                }

                const restLocators = _locators.slice(i + 1);

                if (root && restLocators.length) {
                    return _searchRootElement(restLocators, root);
                }

                return root ?? null;
            }
        }

        if (selectors.length) {
            const query = createQuerySelector(selectors);
            const root = await container.$(query);

            searchLog.push(createGetElementByQuerySelectorLogMessage({container, query, result: root}));

            return root;
        }

        return null;
    };

    const root = await _searchRootElement(locators.flat(), context.browser);

    if (root) {
        return root;
    }

    throw new RootElementNotFoundError(searchLog);
};
