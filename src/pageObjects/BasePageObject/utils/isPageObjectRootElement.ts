import type {PageElement} from '../../../pageElements';
import {isPageElementMatchWithSelector} from '../../../pageElements';
import type {BasePageObject, GetPageObjectPageElement, PageObjectCtor} from '../index';

/**
 * В TS нельзя писать асинхронные гарды, но есть весьма лаконичный воркэраунд для таких ситуаций.
 * @see https://github.com/microsoft/TypeScript/issues/37681
 */
export const isPageObjectRootElement = async <T extends BasePageObject, E extends GetPageObjectPageElement<T>>(
    elem: PageElement,
    Ctor: PageObjectCtor<T>,
): Promise<E | null> => {
    // console.debug(elem);
    // console.debug(Ctor.rootSelector);
    const isMatch = await isPageElementMatchWithSelector(elem, Ctor.rootSelector);

    return isMatch ? (elem as E) : null;
};
