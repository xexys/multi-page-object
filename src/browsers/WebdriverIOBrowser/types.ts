export type WebdriverIOBrowserAPI = WebdriverIO.Browser;

export type WebdriverIOElementPromise = ChainablePromiseElement;

export type CreateElementPromiseCallback = () =>
    | {value: WebdriverIO.Element; selector: string}
    | Promise<{value: WebdriverIO.Element; selector: string}>;
