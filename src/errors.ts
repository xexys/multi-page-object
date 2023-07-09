import type {PageElement, SearchPageElement} from './pageElements';
import {searchPageElementToString} from './pageElements';
import type {BasePageObject} from './pageObjects';
import type {RootElementMapper} from './locators';
import {WaitError} from './utils';

// Знаки табуляции не используем, так как они кривовато выводятся в Allure отчете.
const SPACE = ' ';
const INDENT = SPACE.repeat(4);

export class RootElementMustMatchSpecificSelectorError extends Error {
    constructor(root: PageElement, selector: string) {
        super(`Root element '${searchPageElementToString(root)}' must match specific selector '${selector}'!`);
    }
}

export class RootElementNotFoundError extends Error {
    constructor(searchSteps: string[]) {
        const message = createNotFoundErrorMessage(searchSteps);

        super(`Root element not found!\n\n${message}`);
    }
}

export class RootElementWaitError extends WaitError {
    constructor(pageObject: BasePageObject, addMessage: string) {
        const Ctor = pageObject.getCtor();
        const message = `Root element '${Ctor.rootSelector}' of '${Ctor.name}' page object ${addMessage}!`;

        super(message);
    }
}

/**
 * Возвращает текст ошибки о том, что элемент не найден.
 */
const createNotFoundErrorMessage = (searchLog: string[]) => {
    const rows = ['Search steps:'];

    for (const message of searchLog) {
        rows.push(`${INDENT}- ${message}`);
    }

    return rows.map(row => `${INDENT}${row}`).join('\n');
};

export const createGetElementByQuerySelectorAllLogMessage = (params: {
    container: SearchPageElement;
    query: string;
    result: PageElement[];
}): string => {
    const {container, query, result} = params;

    return `get elements by querySelectorAll (container: ${searchPageElementToString(
        container,
    )}, query: '${query}', resultElementsCount: ${result.length})`;
};

export const createGetElementByQuerySelectorLogMessage = (params: {
    container: SearchPageElement;
    query: string;
    result: PageElement | null | undefined;
}): string => {
    const {container, query, result} = params;

    return `get element by querySelector (container: ${searchPageElementToString(
        container,
    )}, query: '${query}', resultElement: ${result ? searchPageElementToString(result) : result})`;
};

export const createGetElementByIndexLogMessage = (params: {
    index: number;
    result: PageElement | null | undefined;
}): string => {
    const {index, result} = params;

    return `get element by index (index: ${index}, resultElement: ${
        result ? searchPageElementToString(result) : result
    })`;
};

const jsonStringifyReplacer = (key: unknown, value: unknown) => {
    return value instanceof RegExp ? String(value) : value;
};

export const createGetElementByMapperLogMessage = (params: {
    mapper: RootElementMapper;
    result: PageElement | null | undefined;
}): string => {
    const {mapper, result} = params;

    return `get element by mapper (mapper: '${mapper.name || mapper}', resultElement: ${
        result ? searchPageElementToString(result) : result
    }${mapper.__debugParams ? `, debugParams: ${JSON.stringify(mapper.__debugParams, jsonStringifyReplacer)}` : ''})`;
};
