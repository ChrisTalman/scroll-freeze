/** Manages a stack of requests for the DOM <body> to be unscrollable. */
declare class Manager {
    private stackMap;
    private stackCount;
    constructor();
    /** Adds to the freeze stack. */
    stack(): StackItem;
    /** Freezes body. */
    private freeze;
    /** Removes from freeze stack. */
    unstack(item: string | StackItem): void;
    /** Unfreezes body. */
    private unfreeze;
}
/** An item on the freeze stack. */
export declare class StackItem {
    id: string;
    constructor(id: string);
    private initialiseProperties;
    /** Removes the item from the freeze stack. */
    unstack(): void;
}
export declare class ScrollFreezeError extends Error {
    code: string;
    static throw(parameters: ErrorParameters): void;
    constructor(parameters: ErrorParameters);
}
interface ErrorParameters {
    message: string;
    code: string;
}
declare const instance: Manager;
export default instance;
