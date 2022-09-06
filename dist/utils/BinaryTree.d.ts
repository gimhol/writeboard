import { BinaryRange, IBinaryRange } from "./BinaryRange";
import { ITree } from "./ITree";
export declare type BinaryTreeOptions<T = any> = {
    range: IBinaryRange;
    getItemRange: (item: T) => IBinaryRange;
    getTree?: (item: T) => BinaryTree<T> | undefined;
    onTreeChanged?: (item: T, from: BinaryTree<T>, to: BinaryTree<T>) => void;
    maxItems?: number;
};
export declare class BinaryTree<T = any> implements ITree<T> {
    private _range;
    private _items;
    private _child0;
    private _child1;
    private _childRange0;
    private _childRange1;
    private _itemCount;
    private _level;
    private _parent;
    private _opts;
    constructor(opts: BinaryTreeOptions<T>);
    get children(): (BinaryTree<T> | undefined)[];
    get maxItems(): number;
    get parent(): BinaryTree<T> | undefined;
    get level(): number;
    get itemCount(): number;
    get range(): BinaryRange;
    get items(): T[];
    get child0(): BinaryTree<T> | undefined;
    get child1(): BinaryTree<T> | undefined;
    private get genChild0();
    private get genChild1();
    private get childRange0();
    private get childRange1();
    split(): void;
    insert(item: T): BinaryTree<T>;
    removeOnlyUnderMe(item: T): boolean;
    remove(item: T): boolean;
    merge(): void;
}
