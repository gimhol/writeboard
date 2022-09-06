

export type EleMap = HTMLElementTagNameMap
export type EleMapKey = keyof EleMap
export type EleHandler<T> = (ele: T, prev?: T) => void
export type UIState = { [key in string]?: any }
export interface UIRenderFunc<S extends UIState> { (ui: UI<S>): void }
export interface StyleDeclaration extends Partial<CSSStyleDeclaration> { }
export interface Options {
  style?: StyleDeclaration
  attrs?: { [key in string]: string }
  offscreen?: boolean
}
export class UI<S extends UIState> {
  private root: HTMLElement | undefined
  private eleStack: HTMLElement[] = []
  private eles: { [key in string]?: HTMLElement } = {}
  private render: UIRenderFunc<S>
  state: S

  constructor(container: HTMLElement, initState: S | (() => S), render: UIRenderFunc<S>) {
    this.eleStack = [container]
    this.render = render
    this.state = (typeof initState !== 'function') ? initState : initState()
    this.render(this)
  }

  setState(state: S | ((old: S) => S)) {
    this.state = (typeof state !== 'function') ? state : state(this.state)
    this.render(this)
  }

  refresh() {
    this.render(this)
  }

  null() {
    const parent = this.eleStack[this.eleStack.length - 1]
    const child = document.createElement('div')
    child.style.display = 'none'
    this.appendChild(parent, child)
  }

  private applyOptions(ele: HTMLElement | undefined, options: Options | undefined) {
    if (!ele || !options) return
    for (const key in options) {
      if (key === 'style' || key === 'attributes') continue
      (ele as any)[key] = (options as any)[key]
    }
    for (const key in options?.style)
      (ele.style as any)[key] = (options?.style as any)[key]
    for (const key in options?.attrs)
      ele.setAttribute(key, (options!.attrs as any)[key])
  }

  private appendChild(parent: HTMLElement, child: HTMLElement, options?: Options) {
    if (parent === this.eleStack[0]) {
      if (!options?.offscreen)
        this.root ? parent.replaceChild(child, this.root) : parent.appendChild(child)
      this.root = child
    } else {
      !options?.offscreen && parent.appendChild(child)
    }
  }

  dynamic<T extends EleMapKey>(
    tagName: T,
    arg2?: EleHandler<EleMap[T]> | Omit<Partial<EleMap[T]>, 'style'> & Options,
    arg3?: EleHandler<EleMap[T]>): EleMap[T] {

    const updater = typeof arg2 === 'function' ? arg2 : arg3
    const options = typeof arg2 === 'function' ? undefined : { ...arg2 }

    const endIdx = this.eleStack.length - 1
    const parent = this.eleStack[endIdx]
    const key = `${tagName}_${endIdx}_${parent.childNodes.length}_${!!options?.offscreen}`
    const prev = this.eles[key] as (EleMap[T] | undefined)
    const child = document.createElement(tagName)

    this.eleStack.push(child)
    this.eles[key] = child
    this.applyOptions(child, options)
    updater && updater(child, prev)
    this.appendChild(parent, child, options)
    this.eleStack.pop()
    return child
  }

  static<T extends EleMapKey>(
    tagName: T,
    arg2?: EleHandler<EleMap[T]> | Omit<Partial<EleMap[T]>, 'style'> & Options,
    arg3?: EleHandler<EleMap[T]>,
    arg4?: EleHandler<EleMap[T]>
  ): EleMap[T] {
    const options = typeof arg2 !== 'function' ? arg2 : undefined
    const init = typeof arg2 === 'function' ? arg2 : arg3
    const updater = typeof arg2 === 'function' ? arg3 : arg4

    const endIdx = this.eleStack.length - 1
    const parent = this.eleStack[endIdx]
    const key = `${tagName}_${endIdx}_${parent.childNodes.length}_${!!options?.offscreen}`
    const child = this.eles[key] as (EleMap[T] | undefined) || document.createElement(tagName)

    this.applyOptions(child, options)
    if (key in this.eles) {
      this.eleStack.push(child)
      updater && updater(child)
    } else {
      this.eles[key] = child
      this.eleStack.push(child)
      init && init(child)
    }
    this.appendChild(parent, child, options)
    this.eleStack.pop()
    return child
  }
}