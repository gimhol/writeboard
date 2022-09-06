export interface ITree<T = any> {
    get itemCount(): number;
    get level(): number;
    get items(): T[];
    get parent(): ITree<T> | undefined;
    split(): void;
    insert(item: T): ITree<T>;
    remove(item: T): boolean;
}
