export type EleMap = HTMLElementTagNameMap;
export type EleMapKey = keyof EleMap;
export type EleHandler<T> = (ele: T, prev?: T) => void;
export type UIState = {
    [key in string]?: any;
};
export interface UIRenderFunc<S extends UIState> {
    (ui: UI<S>): void;
}
export interface StyleDeclaration extends Partial<CSSStyleDeclaration> {
}
export interface Options {
    style?: StyleDeclaration;
    attrs?: {
        [key in string]: string;
    };
    offscreen?: boolean;
}
export declare class UI<S extends UIState> {
    private root;
    private eleStack;
    private eles;
    private render;
    state: S;
    constructor(container: HTMLElement, initState: S | (() => S), render: UIRenderFunc<S>);
    setState(state: S | ((old: S) => S)): void;
    refresh(): void;
    null(): void;
    private applyOptions;
    private appendChild;
    dynamic<T extends EleMapKey>(tagName: T, arg2?: EleHandler<EleMap[T]> | Omit<Partial<EleMap[T]>, 'style'> & Options, arg3?: EleHandler<EleMap[T]>): EleMap[T];
    static<T extends EleMapKey>(tagName: T, arg2?: EleHandler<EleMap[T]> | Omit<Partial<EleMap[T]>, 'style'> & Options, arg3?: EleHandler<EleMap[T]>, arg4?: EleHandler<EleMap[T]>): EleMap[T];
}
