import assert from 'assert';

import type {BasePageObject} from '../index';

export const assertRootSelector = ({rootSelector, name}: typeof BasePageObject): void => {
    assert(rootSelector, `Value '${rootSelector}' of '${name}.rootSelector' must not be empty!`);
    assert(
        typeof rootSelector === 'string',
        `Value '${rootSelector}' of '${name}.rootSelector' must be valid CSS selector string!`,
    );
};
