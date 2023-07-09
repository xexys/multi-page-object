import assert from 'assert';

import type {PageElementElement, PageElementValue} from '../PageElement';
import {PageElement} from '../PageElement';

type Params<T> = {
    value: T;
    selector: string;
};

export abstract class BasePageElement<T extends PageElementElement, V extends PageElementValue> extends PageElement<T> {
    readonly value: V;

    constructor(params: Params<V>) {
        super(params);

        this.value = params.value;
    }

    async $get<E extends Element>(selector: string): Promise<PageElement<E>> {
        const elem = await this.$<E>(selector);

        assert(elem, `Element by selector '${selector}' not found (⊙ _ ⊙ )!`);

        return elem;
    }
}
