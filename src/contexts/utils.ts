import assert from 'assert';

import type {TestContext} from './TestContext';

let context: TestContext;

export const setGlobalTestContext = (value: TestContext): void => {
    assert(value, `Test context value must not be empty!`);

    context = value;
};

export const getGlobalTestContextSafe = (): TestContext | undefined => {
    return context;
};

export const getGlobalTestContext = (): TestContext => {
    assert(context, `Test context must be defined!`);

    return context;
};
