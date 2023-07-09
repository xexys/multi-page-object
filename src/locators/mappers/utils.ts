import type {RootElementMapperDebugParams, RootElementMapperImpl, RootElementMapper} from '../types';

/**
 * Хелпер для создания мапперов. Добавляет в оборачиваемую ф-ию свойство __debugParams,
 * которое используется при выводе информации об ошибках поиска root-элементов.
 */
export const createRootElementMapper = (
    fn: RootElementMapperImpl,
    debugParams: RootElementMapperDebugParams,
): RootElementMapper => {
    return Object.assign(fn, {__debugParams: debugParams});
};
