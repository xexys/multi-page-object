import assert from 'assert';

import type {BasePageObject} from '../pageObjects';

export const step = <P extends any[]>(name: string | ((...args: P) => string)) => {
    return <R>(
        target: BasePageObject,
        methodName: string,
        descriptor: TypedPropertyDescriptor<(...args: P) => Promise<R>>,
    ) => {
        const method = descriptor.value;
        const Ctor = target.constructor;

        // Похоже, что такого никогда не может быть.
        assert(method, `Method '${methodName}' of '${Ctor.name}' class must be defined!`);

        descriptor.value = function (this: BasePageObject, ...args: P): Promise<R> {
            const stepName = typeof name === 'function' ? name(...args) : name;

            /**
             * Важно! В качестве контекста используем this, а не target, так как target указывает
             * на поле prototype того класса, которому принадлежит декорируемый метод, а не на контекст вызова.
             */
            return this.context.step(stepName, () => method.apply(this, args));
        };
    };
};
