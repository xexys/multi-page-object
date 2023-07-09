import {PageElement} from '../../pageElements';

/**
 * Рекурсивно в глубину обходит объекты и массивы, и маппит значения PageElement в PageElement['value'].
 */
export const prepareExecuteCallbackArgs = (value: any): any => {
    if (value instanceof PageElement) {
        return value.value;
    }

    if (Array.isArray(value)) {
        return value.map(prepareExecuteCallbackArgs);
    }

    if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        const obj: Record<string, any> = {};

        for (const key of keys) {
            obj[key] = prepareExecuteCallbackArgs(value[key]);
        }

        return obj;
    }

    return value;
};
