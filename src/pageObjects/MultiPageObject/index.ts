import type {WEP} from '@yandex-market/ginny';

import {toDOMElement, toWebElementPromise} from '../../adapters';
import {waitFor, waitForNot} from '../../utils';
import type {WaitForOptions} from '../../utils';
import {RootElementWaitError} from '../../errors';
import type {PageElement} from '../../pageElements';
import type {RootElementSelector} from '../../locators';
import {BasePageObject} from '../BasePageObject';
import type {PageObjectCtorLocatorArg, PageObjectCtor} from '../BasePageObject';
import {isPageObjectCtor} from '../utils';

/**
 * Базовый абстрактный класс для создания PageObject-объектов для работы с элементами в тестах.
 *
 * - Важно!
 *   Добавляйте в класс новые методы, действительно общие для всех элементов типа Element.
 *
 * - Тип root элемента по умолчанию задан как HTMLElement, но может быть переопределен в наследуемом классе.
 *   @example
 *   class MyPageObject extends MultiPageObject<HTMLAnchorElement> {}
 */
export abstract class MultiPageObject<T extends Element = HTMLElement> extends BasePageObject<PageElement<T>> {
    public toDOMElement(): Promise<T> {
        return toDOMElement(this);
    }

    public toWEP(): WEP {
        return toWEP(this);
    }

    public toWebElementPromise(): WEP {
        return toWebElementPromise(this);
    }

    public async click(): Promise<void> {
        return (await this.rootElement).click();
    }

    public async dblClick(): Promise<void> {
        return (await this.rootElement).dblClick();
    }

    public async outsideClick(): Promise<void> {
        return (await this.rootElement).outsideClick();
    }

    public async hover(): Promise<void> {
        return (await this.rootElement).hover();
    }

    public async unhover(): Promise<void> {
        return (await this.rootElement).unhover();
    }

    public async getText(): Promise<string> {
        const root = await this.rootElement;
        const text = await root.getTextContent();

        return (text ?? '').trim();
    }

    public async getAttribute(name: string): Promise<string | null> {
        return (await this.rootElement).getAttribute(name);
    }

    public async getProperty<K extends keyof T>(name: K): Promise<T[K]> {
        return (await this.rootElement).getProperty(name);
    }

    public async hasAttribute(name: string): Promise<boolean> {
        return (await this.rootElement).hasAttribute(name);
    }

    /**
     * Проверяет, что элемент есть в DOM, независимо от его видимости с точки зрения пользователя.
     */
    public async isExisting(): Promise<boolean> {
        const root = await this._getRootElementSafe();

        return root ? root.isExisting() : false;
    }

    /**
     * Проверяет, что элемент есть в DOM, и с точки зрения пользователя его видно.
     */
    public async isVisible(): Promise<boolean> {
        const root = await this._getRootElementSafe();

        return root ? root.isVisible() : false;
    }

    /**
     * Ожидает, что элемент есть в DOM, независимо от его видимости с точки зрения пользователя.
     */
    public async waitForExist(options?: WaitForOptions): Promise<void> {
        const error = new RootElementWaitError(this, 'is not exist');

        await this._waitFor(() => this.isExisting(), {error, ...options});
    }

    /**
     * Ожидает, что элемент отсутствует в DOM.
     */
    public async waitForNotExist(options?: WaitForOptions): Promise<void> {
        const error = new RootElementWaitError(this, 'is still exist');

        await this._waitForNot(() => this.isExisting(), {error, ...options});
    }

    /**
     * Ожидает, что элемент есть в DOM, и с точки зрения пользователя его видно.
     */
    public async waitForVisible(options?: WaitForOptions): Promise<void> {
        const error = new RootElementWaitError(this, 'is not visible');

        await this._waitFor(() => this.isVisible(), {error, ...options});
    }

    /**
     * Ожидает, что элемент есть в DOM, но с точки зрения пользователя его не видно.
     */
    public async waitForNotVisible(options?: WaitForOptions): Promise<void> {
        const error = new RootElementWaitError(this, 'is still visible');

        await this._waitForNot(() => this.isVisible(), {error, ...options});
    }

    protected async _waitFor<R>(condition: () => R | Promise<R>, options: WaitForOptions = {}): Promise<void> {
        await waitFor(this.context, condition, options);
    }

    protected async _waitForNot<R>(condition: () => R | Promise<R>, options: WaitForOptions = {}): Promise<void> {
        await waitForNot(this.context, condition, options);
    }

    /**
     * Возвращает объект SimpleMultiPageObject, который ссылается на элемент внутри текущего PageObject.
     * Текущий PageObject выступает в качестве родительского объекта.
     *
     * Это удобный способ работы с элементами, если вам не требуется создавать отдельный PageObject.
     *
     * @example
     *  class Foo extends MultiPageObject {
     *      static rootSelector = '.foo';
     *  }
     *
     *  const foo: Foo = new Foo(); // .foo
     *  const bar: SimpleMultiPageObject = foo._getPageObject('.bar'); // .foo .bar
     */
    protected _getPageObject<E extends Element = HTMLElement>(
        locator: PageObjectCtorLocatorArg,
    ): SimpleMultiPageObject<E>;

    /**
     * Возвращает объект PageObject, который ссылается на элемент внутри текущего PageObject.
     * Текущий PageObject выступает в качестве родительского объекта.
     *
     * @example
     *  class Bar extends MultiPageObject {
     *      static rootSelector = '.bar';
     *  }
     *  class Foo extends MultiPageObject {
     *      static rootSelector = '.foo';
     *
     *      get bar() {
     *          return this._getPageObject(Bar);
     *      }
     *  }
     *
     *  const foo: Foo = new Foo(); // .foo
     *  const bar1: Bar = new Bar(); // .bar
     *  const bar2: Bar = foo.bar; // .foo .bar
     */
    protected _getPageObject<I extends BasePageObject>(Ctor: PageObjectCtor<I>, locator?: PageObjectCtorLocatorArg): I;

    protected _getPageObject(
        ...args: [locator: PageObjectCtorLocatorArg] | [Ctor: PageObjectCtor, locator?: PageObjectCtorLocatorArg]
    ) {
        if (isPageObjectCtor(args[0])) {
            const [Ctor, locator] = args;

            return new Ctor(this, locator);
        }

        return new SimpleMultiPageObject(this, args[0]);
    }

    /**
     * Возвращает объект PageObject, который ссылается на элемент внутри документа.
     * Служит для инстанцирования объектов без родителя, которым необходимо дополнительно устанавливать контекст,
     * в котором выполняется тест.
     *
     * @example
     *  class Bar extends MultiPageObject {
     *      static rootSelector = '.bar';
     *  }
     *  class Foo extends MultiPageObject {
     *      static rootSelector = '.foo';
     *
     *      get bar() {
     *          return this._getGlobalPageObject(Bar);
     *      }
     * }
     *
     *  const foo: Foo = new Foo(); // .foo
     *  const bar: Bar = foo.bar; // .bar
     */
    protected _getGlobalPageObject<I extends BasePageObject>(
        Ctor: PageObjectCtor<I>,
        locator?: PageObjectCtorLocatorArg,
    ): I {
        return new Ctor(this.context, locator);
    }

    /**
     * Подсчет количества DOM элементов, найденных по селектору относительно root-элемента PageObject-а.
     *
     * @example
     * class Foo extends MultiPageObject {
     *      static rootSelector = '.foo';
     *
     *      getBarCount(): Promise<number> {
     *          return this._countPageObjects('.bar');
     *      }
     *  }
     *
     *  const foo = new Foo(); // .foo
     *  const barCount  = await foo.getBarCount() // Количество элементов, найденных по селектору '.foo .bar'
     */
    protected async _countPageObjects(selector: RootElementSelector): Promise<number>;

    /**
     * Подсчет количества DOM элементов, найденных по селектору относительно root-элемента PageObject-а.
     * В качестве селектора используется rootSelector передаваемого конструктора PageObject-ов.
     *
     * @example
     * class Bar extends MultiPageObject {
     *      static rootSelector = '.bar';
     * }
     *
     * class Foo extends MultiPageObject {
     *      static rootSelector = '.foo';
     *
     *      getBarCount(): Promise<number> {
     *          return this._countPageObjects(Bar);
     *      }
     *  }
     *
     *  const foo = new Foo(); // .foo
     *  const barCount  = await foo.getBarCount() // Количество элементов, найденных по селектору '.foo .bar'
     */
    protected async _countPageObjects<I extends BasePageObject>(Ctor: PageObjectCtor<I>): Promise<number>;

    protected async _countPageObjects(arg: PageObjectCtor | RootElementSelector): Promise<number> {
        const selector = isPageObjectCtor(arg) ? arg.rootSelector : arg;
        const root = await this.rootElement;

        return (await root.$$(selector)).length;
    }
}

class SimpleMultiPageObject<T extends Element = HTMLElement> extends MultiPageObject<T> {
    static rootSelector = '*';
}
