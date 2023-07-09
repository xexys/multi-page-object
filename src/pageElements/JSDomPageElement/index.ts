// import assert from 'assert';
// import fs from 'fs';
// import {basename as getBaseName} from 'path';
//
// import mime from 'mime-types';
// import userEvent from '@testing-library/user-event';
//
// import {assertSelector, toObjectString} from '../utils';
// import type {PageElement, SetValueOptions} from '../PageElement';
// import {BasePageElement} from '../BasePageElement';
//
// export type JSDomPageElementValue<T extends Element> = T;
//
// export class JSDomPageElement<T extends Element> extends BasePageElement<T, JSDomPageElementValue<T>> {
//     async $<E extends Element>(selector: string): Promise<PageElement<E> | null> {
//         assertSelector(selector);
//
//         const value = this.value.querySelector<E>(selector);
//
//         return value ? new JSDomPageElement({value, selector}) : null;
//     }
//
//     async $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>> {
//         assertSelector(selector);
//
//         const values = this.value.querySelectorAll<E>(selector);
//
//         return Array.from(values, value => new JSDomPageElement({value, selector}));
//     }
//
//     public async click(): Promise<void> {
//         userEvent.click(this.value);
//     }
//
//     public async dblClick(): Promise<void> {
//         userEvent.dblClick(this.value);
//     }
//
//     public async outsideClick(): Promise<void> {
//         userEvent.click(document.documentElement);
//     }
//
//     public async getTextContent(): Promise<string | null> {
//         return this.value.textContent;
//     }
//
//     public async getAttribute(name: string): Promise<string | null> {
//         return this.value.getAttribute(name);
//     }
//
//     public async hasAttribute(name: string): Promise<boolean> {
//         return this.value.hasAttribute(name);
//     }
//
//     public async getProperty<K extends keyof T>(name: K): Promise<T[K]> {
//         return this.value[name];
//     }
//
//     public async getTagName(): Promise<string> {
//         return this.value.tagName.toLowerCase();
//     }
//
//     public async getValue(): Promise<string> {
//         const elem = ensureTextFieldElement(this.value);
//
//         return elem.value;
//     }
//
//     public async typeValue(value: string | number, {mode = 'replace'}: SetValueOptions = {}): Promise<void> {
//         const elem = ensureTextFieldElement(this.value);
//
//         if (mode === 'replace') {
//             if (value === '') {
//                 userEvent.clear(elem);
//                 return;
//             }
//
//             if (elem.value.length) {
//                 elem.setSelectionRange(0, elem.value.length);
//             }
//         }
//
//         userEvent.type(elem, String(value));
//     }
//
//     public async pasteValue(value: string | number, {mode = 'replace'}: SetValueOptions = {}): Promise<void> {
//         const elem = ensureTextFieldElement(this.value);
//
//         if (mode === 'replace') {
//             if (value === '') {
//                 userEvent.clear(elem);
//                 return;
//             }
//
//             if (elem.value.length) {
//                 elem.setSelectionRange(0, elem.value.length);
//             }
//         }
//
//         userEvent.paste(elem, String(value));
//     }
//
//     public async isExisting(): Promise<boolean> {
//         try {
//             expect(this.value).toBeInTheDocument();
//             return true;
//         } catch (error: unknown) {
//             return false;
//         }
//     }
//
//     public async isVisible(): Promise<boolean> {
//         try {
//             expect(this.value).toBeVisible();
//             return true;
//         } catch (error: unknown) {
//             return false;
//         }
//     }
//
//     public async matches(selector: string): Promise<boolean> {
//         return this.value.matches(selector);
//     }
//
//     public async hover(): Promise<void> {
//         userEvent.hover(this.value);
//     }
//
//     public async unhover(): Promise<void> {
//         userEvent.unhover(this.value);
//     }
//
//     public async uploadFiles(...paths: string[]): Promise<void> {
//         const elem = ensureInputElement(this.value);
//
//         if (!elem.multiple && paths.length > 1) {
//             assert.fail(`Element '${toObjectString(elem)}' can not hold multiple files!`);
//         }
//
//         const files = await Promise.all(
//             paths.map(async path => {
//                 const name = getBaseName(path);
//                 const type = mime.lookup(path) || 'application/octet-stream';
//                 const buffer = await fs.promises.readFile(path);
//
//                 return new File([buffer], name, {type});
//             }),
//         );
//
//         userEvent.upload(elem, files);
//     }
// }
//
// const ensureInputElement = (elem: Element): HTMLInputElement => {
//     if (!(elem instanceof HTMLInputElement)) {
//         assert.fail(`Element '${toObjectString(elem)}' must be instance of HTMLInputElement!`);
//     }
//
//     return elem;
// };
//
// const ensureTextFieldElement = (elem: Element): HTMLInputElement | HTMLTextAreaElement => {
//     if (!(elem instanceof HTMLInputElement || elem instanceof HTMLTextAreaElement)) {
//         assert.fail(`Element '${toObjectString(elem)}' must be instance of HTMLInputElement or HTMLTextAreaElement!`);
//     }
//
//     return elem;
// };
