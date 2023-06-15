import { View } from "../../BaseView/View";
import { DockableEventMap } from "../../Events/EventType";
import { WorkspaceView } from "./WorkspaceView";

export interface IDockable<V extends View = View> {
  onDocked(): void;
  onUndocked(): void;
  resizeDocked(width: number | undefined, height: number | undefined): void;
  dockableView(): V;
  workspace(): WorkspaceView | undefined;
  setWorkspace(v: WorkspaceView | undefined): V;
  dispatchEvent<K extends keyof DockableEventMap>(ev: DockableEventMap[K]): boolean;
  addEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  removeEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): this;
}
