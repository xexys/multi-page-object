import type {DeepMappedType} from '../../types'

import type {PageElement, SearchPageElement} from '../../pageElements';

export type SerializeData<D> = DeepMappedType<D, Element, PageElement>;

export type DeserializeData<D> = DeepMappedType<D, PageElement, Element>;

export type ExecuteCallback<P extends unknown[], R> = (...args: DeserializeData<P>) => R | Promise<R>;

export abstract class TestBrowser implements SearchPageElement {
    abstract $<E extends Element>(selector: string): Promise<PageElement<E> | null>;

    abstract $get<E extends Element>(selector: string): Promise<PageElement<E>>;

    abstract $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>>;

    abstract execute<P extends unknown[], R>(fn: ExecuteCallback<P, R>, ...args: P): Promise<SerializeData<R>>;
}
