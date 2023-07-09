export interface SearchPageElement {
    $<E extends Element>(selector: string): Promise<PageElement<E> | null>;

    $get<E extends Element>(selector: string): Promise<PageElement<E>>;

    $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>>;
}

/**
 * Тип, с помощью которого описываем над каким элементом введена абстракция PageElement.
 * Например, тип PageElement<HTMLInputElement> говорит о том, что PageElement описывает элемент HTMLInputElement в DOM.
 */
export type PageElementElement = Element;

/**
 * Тип для описания реального значения, для которого введена абстракция PageElement.
 * В зависимости от конкретной реализации тип значения может быть разным.
 * Для JSDom - это тип Element.
 * Для WebdriverIO - это тип {ELEMENT: string}.
 */
export type PageElementValue = object;

export type SetValueOptions = {
    mode?: 'add' | 'replace';
};

type Params = {
    value: PageElementValue;
    selector: string;
};

export abstract class PageElement<T extends PageElementElement = PageElementElement> implements SearchPageElement {
    readonly value: PageElementValue;

    readonly selector: string;

    protected constructor({value, selector}: Params) {
        this.value = value;
        this.selector = selector;
    }

    /**
     * Поиск элемента по селектору.
     * Возвращает первый найденный элемент или null.
     */
    abstract $<E extends Element>(selector: string): Promise<PageElement<E> | null>;

    /**
     * Поиск элемента по селектору.
     * Возвращает первый найденный элемент.
     * Если элемент не найден - выбрасывает исключение.
     */
    abstract $get<E extends Element>(selector: string): Promise<PageElement<E>>;

    /**
     * Поиск элементов по селектору.
     * Возвращает массив элементов, или пустой массив если элементы не были найдены.
     */
    abstract $$<E extends Element>(selector: string): Promise<Array<PageElement<E>>>;

    abstract click(): Promise<void>;

    abstract dblClick(): Promise<void>;

    abstract outsideClick(): Promise<void>;

    abstract getTextContent(): Promise<string | null>;

    abstract getAttribute(name: string): Promise<string | null>;

    abstract hasAttribute(name: string): Promise<boolean>;

    abstract getProperty<K extends keyof T>(name: K): Promise<T[K]>;

    /**
     * Возвращает имя тега в нижнем регистре.
     */
    abstract getTagName(): Promise<string>;

    /**
     * Возвращает текстовое значение для HTMLInputElement или HTMLTextAreaElement элемента.
     */
    abstract getValue(): Promise<string>;

    /**
     * Посимвольно вводит текстовое значение для HTMLInputElement или HTMLTextAreaElement элемента.
     * После каждого нового символа возникает React-событие 'change'.
     */
    abstract typeValue(value: string | number, options?: SetValueOptions): Promise<void>;

    /**
     * Вставляет текстовое значение для HTMLInputElement или HTMLTextAreaElement элемента.
     * После вставки значения возникают React-события 'paste' и 'change' (событие 'change' возникает только если значение изменилось).
     */
    abstract pasteValue(value: string | number, options?: SetValueOptions): Promise<void>;

    abstract isExisting(): Promise<boolean>;

    abstract isVisible(): Promise<boolean>;

    abstract matches(selector: string): Promise<boolean>;

    abstract hover(): Promise<void>;

    abstract unhover(): Promise<void>;

    abstract uploadFiles(...paths: string[]): Promise<void>;
}
