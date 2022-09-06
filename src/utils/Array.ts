export interface ItemFunc<Item> { (v: Item, idx: number, arr: Item[]): boolean }

export const findIndex = <Item>(arr: Item[], func: ItemFunc<Item>): number => {
  for (let i = 0; i < arr.length; ++i) {
    if (func(arr[i], i, arr))
      return i
  }
  return -1
}