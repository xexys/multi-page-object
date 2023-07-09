/**
 * @see https://pptr.dev/api/puppeteer.puppeteernode
 */
import type {ElementHandle} from 'puppeteer';

import {assertSelector} from '../utils';
import type {PageElement, SetValueOptions} from '../PageElement';
import {BasePageElement} from '../BasePageElement';

export type PuppeteerPageElementValue<T extends Element> = ElementHandle<T>;

export class PuppeteerPageElement<T extends Element> extends BasePageElement<T, PuppeteerPageElementValue<T>> {
    async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
        assertSelector(selector);

        const value = await this.value.$<E>(selector);

        return value ? new PuppeteerPageElement({value, selector}) : null;
    }

    async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
        assertSelector(selector);

        const values = await this.value.$$<E>(selector);

        return values.map(value => new PuppeteerPageElement({value, selector}));
    }

    public async click(): Promise<void> {
        await this.value.click();
    }

    public async dblClick(): Promise<void> {
        // @see https://stackoverflow.com/questions/64384430/how-to-double-click-in-puppeteer
        throw new Error('This method is not implemented yet!');
    }

    public async outsideClick(): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }

    public async getTextContent(): Promise<string | null> {
        throw new Error('This method is not implemented yet!');
    }

    public async getAttribute(_name: string): Promise<string | null> {
        throw new Error('This method is not implemented yet!');
    }

    public async hasAttribute(_name: string): Promise<boolean> {
        throw new Error('This method is not implemented yet!');
    }

    public async getProperty<K extends keyof T>(_name: K): Promise<T[K]> {
        throw new Error('This method is not implemented yet!');
    }

    public async getTagName(): Promise<string> {
        throw new Error('This method is not implemented yet!');
    }

    public async getValue(): Promise<string> {
        throw new Error('This method is not implemented yet!');
    }

    public async typeValue(_value: string | number, _options?: SetValueOptions): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }

    public async pasteValue(_value: string | number, _options?: SetValueOptions): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }

    public async isExisting(): Promise<boolean> {
        throw new Error('This method is not implemented yet!');
    }

    public async isVisible(): Promise<boolean> {
        throw new Error('This method is not implemented yet!');
    }

    public async matches(_selector: string): Promise<boolean> {
        throw new Error('This method is not implemented yet!');
    }

    public async hover(): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }

    public async unhover(): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }

    public async uploadFiles(..._paths: string[]): Promise<void> {
        throw new Error('This method is not implemented yet!');
    }
}
