import {BasePageObject} from './BasePageObject';
import type {PageObjectCtor} from './BasePageObject';

export const isPageObjectCtor = (value: unknown): value is PageObjectCtor => {
    /**
     * @see https://stackoverflow.com/questions/14486110/how-to-check-if-a-javascript-class-inherits-another-without-creating-an-obj
     */
    return typeof value === 'function' && (value === BasePageObject || value.prototype instanceof BasePageObject);
};
