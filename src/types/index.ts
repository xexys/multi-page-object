type Tuple<T = unknown> = Readonly<T[]>;

type _DeepMappedTypeTuple<T extends Readonly<unknown[]>, From, To> = _DeepMappedTypeObject<T, From, To>;

type _DeepMappedTypeArray<T extends unknown[], From, To> = DeepMappedType<T[number], From, To>;

type _DeepMappedTypeObject<T extends object, From, To> = {[K in keyof T]: DeepMappedType<T[K], From, To>};

/**
 * Хелпер для маппинга типа T в тип To, если T соответствует типу From.
 * Может быть использован для сериализации данных.
 *
 * @example
 *  type A = number
 *  type B = MappedType<A, number, string> // string
 *
 * @example
 *  type A = object
 *  type B = MappedType<A, number, string> // object
 */
export type MappedType<T, From, To> = T extends From ? To : T;

/**
 * Хелпер для маппинга типа T в тип To, если T соответствует типу From.
 * Работает аналогично MappedType, но рекурсивно в глубину.
 *
 * @example
 *  type A = [number, number[], object]
 *  type B = MappedType<A, number, string> // [string, string[], object]
 */
export type DeepMappedType<T, From, To> = T extends From
    ? To
    : T extends Tuple
        ? _DeepMappedTypeTuple<T, From, To>
        : T extends unknown[]
            ? _DeepMappedTypeArray<T, From, To>
            : T extends object
                ? _DeepMappedTypeObject<T, From, To>
                : T;
