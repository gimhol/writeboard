export interface ItemFunc<Item> {
    (v: Item, idx: number, arr: Item[]): boolean;
}
export declare const findIndex: <Item>(arr: Item[], func: ItemFunc<Item>) => number;
