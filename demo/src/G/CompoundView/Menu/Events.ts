import { ViewEventMap } from "../../Events/EventType";
import type { IMenuItemInfo } from "./Info";

export enum MenuEventType {
  ItemClick = 'onItemClick',
}
export interface MenuEventMap<K extends string | number | symbol> extends ViewEventMap {
  [MenuEventType.ItemClick]: CustomEvent<IMenuItemInfo<K>>;
}