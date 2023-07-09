import fs from 'fs';
import {AssertionError} from 'assert';

import {promiseFilter} from 'shared/utils/toolkit';

import {setGlobalTestContext, UnitTestContext} from '../../../contexts';
import {getByIndex} from '../../../locators';
import type {PageElement, JSDomPageElement} from '../../../pageElements';
import {RootElementMustMatchSpecificSelectorError, RootElementNotFoundError} from '../../../errors';
import {isPageObjectRootElement} from '../utils';
import type {PageObjectCtor, PageObjectCtorLocatorArg} from '../index';
import {BasePageObject} from '../index';

setGlobalTestContext(new UnitTestContext());

/**
 * Добавим метод chain в базовый класс исключительно в целях unit-тестирования.
 *
 * Не делайте так в коде реальных тестов!
 * Используйте цепочки геттеров, как это описано в документации к модулю MultiPageObject.
 */
abstract class UnitTestPageObject<T extends Element = HTMLElement> extends BasePageObject<JSDomPageElement<T>> {
    public getRootElementValue(): Promise<T> {
        return this.rootElement.then(root => root.value);
    }

    public chain<I extends BasePageObject>(Ctor: PageObjectCtor<I>, locator?: PageObjectCtorLocatorArg): I {
        return new Ctor(this, locator);
    }
}

class Test extends UnitTestPageObject {
    static rootSelector = '*';
}

class Foo extends UnitTestPageObject {
    static rootSelector = '.foo';

    static rootCustomSelector = `${this.rootSelector}.custom`;
}

class Bar extends UnitTestPageObject {
    static rootSelector = '.bar';
}

class Baz extends UnitTestPageObject {
    static rootSelector = '.baz';
}

const innerHTML = fs.readFileSync(`${__dirname}/index.spec.html`, {encoding: 'utf-8'});

const refreshDom = () => {
    document.documentElement.innerHTML = innerHTML;
};

const runTest = async (po: UnitTestPageObject, expected: string) => {
    const root = await po.getRootElementValue();

    expect(root.textContent).toBe(expected);

    // Обновляем DOM, чтобы проверить, что цепочка вызовов не сломалась.
    refreshDom();

    expect(await po.getRootElementValue()).not.toBe(root);
    expect((await po.getRootElementValue()).textContent).toBe(expected);
};

describe('BasePageObject', () => {
    beforeAll(() => {
        refreshDom();
    });

    describe('Создал PageObject', () => {
        it('через селектор для root элемента', async () => {
            const selector = `#create-po-by-selector ${Foo.rootSelector}`;
            const foo = new Foo(selector);

            await runTest(foo, 'foo');
        });

        it('через родительский PO и индекс', async () => {
            const test = new Test('#create-po-by-parent-and-index');
            const foo = new Foo(test, 1);

            await runTest(foo, 'foo-2');
        });

        it('через родительский PO и маппер', async () => {
            const test = new Test('#create-po-by-parent-and-mapper');
            const foo = new Foo(test, async (context, elems) => {
                const result = await promiseFilter(async elem => {
                    const text = await elem.getTextContent();

                    return text?.match('foo');
                }, elems);

                return result[1];
            });

            await runTest(foo, 'foo-2');
        });

        it('через родительский PO, селектор и индекс', async () => {
            const test = new Test('#create-by-parent-and-selector-and-index');
            const foo = new Foo(test, ['div', 3]);

            await runTest(foo, 'foo-2');
        });

        it('через родительский PO, селектор и маппер', async () => {
            const test = new Test('#create-by-parent-and-selector-and-mapper');
            const foo = new Foo(test, [
                'div',
                async (context, elems) => {
                    const result = await promiseFilter(elem => isPageObjectRootElement(elem, Foo), elems);

                    return result[1];
                },
            ]);

            await runTest(foo, 'foo-2');
        });
    });

    describe('Создал вложенный PageObject', () => {
        it('через его конструктор', async () => {
            const foo = new Test('#get-po-by-ctor').chain(Foo);

            await runTest(foo, 'foo');
        });

        it('через его конструктор и индекс', async () => {
            const foo = new Test('#get-po-by-ctor-and-index').chain(Foo, 1);

            await runTest(foo, 'foo-2');
        });

        it('через его конструктор и селектор', async () => {
            const foo = new Test('#get-po-by-ctor-and-selector').chain(Foo, Foo.rootCustomSelector);

            await runTest(foo, 'foo-2');
        });

        it('через его конструктор и ручное объединение селекторов', async () => {
            const selector = `${Foo.rootSelector}:nth-child(2) ${Bar.rootSelector}:nth-child(1) ${Baz.rootSelector}:nth-child(3)`;
            const baz = new Test('#get-po-from-nested-structure').chain(Baz, selector);

            await runTest(baz, 'baz-2-1-3');
        });

        it('через его конструктор и маппер', async () => {
            const foo = new Test('#get-po-by-ctor-and-mapper').chain(Foo, getByIndex(1));

            await runTest(foo, 'foo-2');
        });

        it('через его конструктор, селектор и индекс', async () => {
            const foo = new Test('#get-po-by-ctor-and-selector-and-index').chain(Foo, ['div', 3]);

            await runTest(foo, 'foo-2');
        });

        it('через его конструктор, селектор и маппер', async () => {
            // Находит первый foo элемент с текстом красного цвета.
            const mapper = async (context: UnitTestContext, elems: PageElement[]) => {
                for (const elem of elems) {
                    const root = await isPageObjectRootElement(elem, Foo);

                    if (root && root.value.style.color === 'red') {
                        return root;
                    }
                }
                return undefined;
            };

            const foo = new Test('#get-po-by-ctor-and-selector-and-mapper').chain(Foo, ['div', mapper]);

            await runTest(foo, 'foo-2');
        });

        it('через цепочку вызова', async () => {
            const baz = new Test('#get-po-from-nested-structure').chain(Foo).chain(Bar).chain(Baz);

            await runTest(baz, 'baz-1-1-1');
        });

        it('через цепочку вызова с использованием селекторов, индексов и мапперов', async () => {
            const baz = new Test('#get-po-from-nested-structure')
                .chain(Foo, [Foo.rootSelector, 1])
                .chain(Bar, 0)
                .chain(Baz, ['div', getByIndex(2)]);

            await runTest(baz, 'baz-2-1-3');
        });

        it('через цепочку вызова и ручное объединение селекторов с применением индексов и мапперов', async () => {
            const baz = new Test('#get-po-from-nested-structure')
                .chain(Bar, [`${Foo.rootSelector} ${Bar.rootSelector}`, getByIndex(2)])
                .chain(Baz, ['.baz', 2]);

            await runTest(baz, 'baz-2-1-3');
        });
    });

    describe('Выбросил исключение если,', () => {
        it('при определении класса не задано статическое поле rootSelector', async () => {
            class PO extends BasePageObject {}

            await expect(() => new PO()).toThrowError(AssertionError);
            await expect(() => new PO()).toThrowErrorMatchingSnapshot();
        });

        it('при определении класса статическое поле rootSelector задано как falsy значение', async () => {
            class PO extends BasePageObject {
                static rootSelector = '';
            }

            await expect(() => new PO()).toThrowError(AssertionError);
            await expect(() => new PO()).toThrowErrorMatchingSnapshot();
        });

        it('при определении класса статическое поле rootSelector задано, но не является строкой', async () => {
            class PO extends BasePageObject {
                static rootSelector = {} as string;
            }

            await expect(() => new PO()).toThrowError(AssertionError);
            await expect(() => new PO()).toThrowErrorMatchingSnapshot();
        });

        it('root элемент не найден, при обращении к полю root', async () => {
            const foo = new Test('#get-po-from-nested-structure')
                .chain(Foo, [Foo.rootSelector, 1])
                .chain(Bar, 0)
                .chain(Baz, getByIndex(10));

            await expect(foo.rootElement).rejects.toThrowError(RootElementNotFoundError);
            await expect(foo.rootElement).rejects.toThrowErrorMatchingSnapshot();
        });

        it('root элемент найден, но он не соответствует root селектору', async () => {
            const rootSelector = `#root-element-must-match-specific-selector-error .foooooooo`;
            const foo = new Foo(rootSelector);

            expect(Boolean(document.querySelector(rootSelector))).toBe(true);

            await expect(foo.rootElement).rejects.toThrowError(RootElementMustMatchSpecificSelectorError);
            await expect(foo.rootElement).rejects.toThrowErrorMatchingSnapshot();
        });
    });
});
