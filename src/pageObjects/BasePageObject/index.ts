import assert from 'assert';

import {RootElementMustMatchSpecificSelectorError, RootElementNotFoundError} from '../../errors';
import {getGlobalTestContextSafe} from '../../contexts';
import type {TestContext} from '../../contexts';
import type {PageElement} from '../../pageElements';
import type {Locator} from '../../locators';
import {assertRootSelector, processArgs, searchRootElement, isPageObjectRootElement} from './utils';
import type {PageObjectCtor, PageObjectCtorArgs} from './types';

export * from './types';

/**
 * Базовый абстрактный класс для создания PageObject объектов.
 *
 * Для работы с элементами страницы в CAT-тестах наследуйте или расширяйте MultiPageObject.
 * @see MultiPageObject
 */
export abstract class BasePageObject<T extends PageElement = PageElement> {
    public static readonly rootSelector: string;

    public readonly context: TestContext;

    private readonly _parent?: BasePageObject;
    private readonly _locator: Locator;

    public constructor(...args: PageObjectCtorArgs) {
        assertRootSelector(this.getCtor());

        const {context, parent, locator} = processArgs(this, args);

        this._parent = parent;
        this._locator = locator;

        const testContext = context ?? parent?.context ?? getGlobalTestContextSafe();

        /**
         * Не нашли контекст!
         * Скорее всего где-то нарушена цепочка при создании объектов через вызов конструктора напрямую (new PageObject).
         * Возможные причины:
         *  - В конструктор не передали родительский PageObject.
         *  - В конструктор не передали контекст для тестов TestContext.
         *  - Не настроен глобальный контекст для тестов.
         */
        assert(testContext, `${this.getCtor().name}: Test context must be defined!`);

        this.context = testContext;
    }

    public get rootElement(): Promise<T> {
        return this._getRootElement();
    }

    /**
     * Возвращает класс, с помощью которого был создан PageObject.
     */
    public getCtor<C extends PageObjectCtor<this>>(): C {
        return this.constructor as C;
    }

    /**
     *  Возвращает root элемент, на который указывает PageObject.
     *
     *  - Если элемента нет на странице, то будет выброшено исключение RootElementNotFoundError.
     *  @throws RootElementNotFoundError
     *
     *  - Если PageObject указывает на элемент, который существует на странице,
     *  но не соответствует его rootSelector-у, то будет выброшено исключение RootElementMustMatchSpecificSelectorError.
     *  @throws RootElementMustMatchSpecificSelectorError
     */
    protected async _getRootElement(): Promise<T> {
        const Ctor = this.getCtor();
        const elem = await searchRootElement(this.context, this._getLocators());
        const root = await isPageObjectRootElement(elem, Ctor);

        if (!root) {
            throw new RootElementMustMatchSpecificSelectorError(elem, Ctor.rootSelector);
        }

        return root;
    }

    /**
     * Возвращает root элемент, на который указывает PageObject.
     *
     * - Если элемента нет на странице, то ловит исключение RootElementNotFoundError и возвращает null.
     *   Любые другие исключения пробрасываются дальше.
     */
    protected _getRootElementSafe(): Promise<T | null> {
        return this._getRootElement().catch((error: unknown) => {
            if (error instanceof RootElementNotFoundError) {
                return null;
            }

            throw error;
        });
    }

    /**
     * Возвращает список локаторов, для последовательного поиска root-элемента.
     */
    private _getLocators(): Locator[] {
        const parentLocators = this._parent ? this._parent._getLocators() : [];

        return [...parentLocators, this._locator];
    }
}
