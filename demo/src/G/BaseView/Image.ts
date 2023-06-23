import { ViewEventMap } from "../Events/EventType";
import { Style } from "./StyleType";
import { View } from "./View";
export interface ImageInit {
  src?: string;
  style?: Style;
}
export class Image extends View<'img'>{
  get src() { return this.inner.src; }
  set src(v) { this.inner.src = v; }

  constructor(inits?: ImageInit) {
    super('img');
    inits?.src && (this.src = inits.src);
    inits?.style && (this.styles.apply('_', inits.style))
  }

  public override addEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  public override addEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.addEventListener(arg0, arg1, arg2)
  }

  public override removeEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): this;
  public override removeEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.removeEventListener(arg0, arg1, arg2)
  }
}