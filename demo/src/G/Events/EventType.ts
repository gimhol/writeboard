import type { ElementDragger } from "../Helper/ElementDragger";

export enum EventType {
  ViewDragStart = 'viewdragstart',
  ViewDragging = 'viewdrag',
  ViewDragEnd = 'viewdragend',
}
export interface EventMap {
  [EventType.ViewDragStart]: CustomEvent<{ pageX: number, pageY: number, dragger: ElementDragger }>;
  [EventType.ViewDragging]: CustomEvent<{ pageX: number, pageY: number, dragger: ElementDragger }>;
  [EventType.ViewDragEnd]: CustomEvent<{ dragger: ElementDragger }>;
}
export enum ViewEventType {
  Added = 'viewadded',
  Removed = 'viewremoved',
}
export interface ViewEventMap extends EventMap {
  [ViewEventType.Added]: Event;
  [ViewEventType.Removed]: Event;
}