import type { ElementDragger } from "../Helper/ElementDragger";

export enum EventType {
  ViewDragStart = 'viewdragstart',
  ViewDragging = 'viewdrag',
  ViewDragEnd = 'viewdragend',
}
export interface EventMap extends HTMLElementEventMap {
  [EventType.ViewDragStart]: CustomEvent<{ pageX: number, pageY: number, dragger: ElementDragger }>;
  [EventType.ViewDragging]: CustomEvent<{ pageX: number, pageY: number, dragger: ElementDragger }>;
  [EventType.ViewDragEnd]: CustomEvent<{ dragger: ElementDragger }>;
  [key: string]: Event;
}
export enum ViewEventType {
  Added = 'viewadded',
  Removed = 'viewremoved',
}
export interface ViewEventMap extends EventMap {
  [ViewEventType.Added]: Event;
  [ViewEventType.Removed]: Event;
}

export enum DockableEventType {
  Docked = 'docked',
  Undocked = 'undocked',
}
export interface DockableEventMap extends ViewEventMap {
  [DockableEventType.Docked]: Event;
  [DockableEventType.Undocked]: Event;
}