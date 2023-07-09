import {TestContext} from '../../../contexts';
import type {Locator} from '../../../locators';
import type {PageObjectCtorLocatorArg, PageObjectCtorArgs} from '../types';
import {BasePageObject} from '../index';

type Result = {
    context?: TestContext;
    parent?: BasePageObject;
    locator: Locator;
};

export const processArgs = (po: BasePageObject, args: PageObjectCtorArgs): Result => {
    let context: TestContext | undefined;
    let parent: BasePageObject | undefined;
    let locatorArg: PageObjectCtorLocatorArg | undefined;

    if (args.length === 1) {
        if (args[0] instanceof BasePageObject) {
            parent = args[0];
        } else if (args[0] instanceof TestContext) {
            context = args[0];
        } else {
            locatorArg = args[0];
        }
    } else if (args.length === 2) {
        if (args[0] instanceof BasePageObject) {
            [parent, locatorArg] = args;
        } else {
            [context, locatorArg] = args;
        }
    }

    return {
        context,
        parent,
        locator: processLocatorArg(po, locatorArg),
    };
};

const processLocatorArg = (po: BasePageObject, arg: PageObjectCtorLocatorArg | undefined): Locator => {
    const {rootSelector} = po.getCtor();

    // Поиск по rootSelector
    if (typeof arg === 'undefined') {
        return rootSelector;
    }

    // Поиск по selector
    if (typeof arg === 'string') {
        return arg;
    }

    // Поиск по rootSelector + index
    if (typeof arg === 'number') {
        return [rootSelector, arg];
    }

    // Поиск по rootSelector + mapper
    if (typeof arg === 'function') {
        return [rootSelector, arg];
    }

    // Поиск по selector + index
    // Поиск по selector + mapper
    return arg;
};
