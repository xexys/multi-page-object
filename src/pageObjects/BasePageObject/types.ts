import type {TestContext} from '../../contexts';
import type {RootElementIndex, RootElementSelector, RootElementMapper} from '../../locators';

import type {BasePageObject} from './index';

export type GetPageObjectPageElement<T extends BasePageObject> = T extends BasePageObject<infer E> ? E : never;

/**
 * Тип, описывающий аргумент с параметрами для локаторов, передаваемый в конструктор для создания PageObject объекта.
 */
export type PageObjectCtorLocatorArg =
    | RootElementIndex
    | RootElementSelector
    | RootElementMapper
    | [RootElementSelector, RootElementIndex]
    | [RootElementSelector, RootElementMapper];

/**
 * Тип, описывающий аргументы, передаваемые в конструктор для создания PageObject объекта.
 */
export type PageObjectCtorArgs =
    | []
    | [locator: PageObjectCtorLocatorArg]
    | [context: TestContext, locator?: PageObjectCtorLocatorArg]
    | [parent: BasePageObject, locator?: PageObjectCtorLocatorArg];

/**
 * Тип, описывающий конструктор для создания PageObject объектов.
 */
export type PageObjectCtor<T extends BasePageObject = BasePageObject> = {
    new (...args: PageObjectCtorArgs): T;
} & {
    rootSelector: RootElementSelector;
};
