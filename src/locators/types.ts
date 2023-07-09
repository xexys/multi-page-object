import type {TestContext} from '../contexts';
import type {PageElement} from '../pageElements';

export type RootElementIndex = number;

export type RootElementSelector = string;

export type RootElementMapper = RootElementMapperImpl & {__debugParams?: RootElementMapperDebugParams};
export type RootElementMapperImpl = (
    context: TestContext,
    elems: PageElement[],
) => Promise<RootElementMapperResult> | RootElementMapperResult;
export type RootElementMapperResult = PageElement | null | undefined;
export type RootElementMapperDebugParams = Record<string, unknown>;

/**
 * Локатор - способ поиска элемента на странице.
 */
export type Locator = SelectorLocator | SelectorAndIndexLocator | SelectorAndMapperLocator;

/**
 * Локатор для поиска элемента по селектору:
 * - Выполняет поиск по селектору.
 * - В качестве результата берет первый найденный элемент.
 */
type SelectorLocator = RootElementSelector;

/**
 * Локатор для поиска элемента по селектору и индексу:
 *  - Выполняет поиск по селектору.
 *  - В качестве результата берет элемент по указанному индексу из массива найденных.
 */
type SelectorAndIndexLocator = [RootElementSelector, RootElementIndex];

/**
 * Локатор для поиска элемента по селектору и мапперу:
 *  - Выполняет поиск по селектору.
 *  - Массив найденных элементов передает в маппер.
 *  - В качестве результата берет элемент, который вернул маппер.
 */
type SelectorAndMapperLocator = [RootElementSelector, RootElementMapper];
