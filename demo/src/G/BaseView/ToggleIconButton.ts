import { IconButton, IconButtonInits } from "./IconButton";

export interface IToggleIconButtonInits extends IconButtonInits { }

export class ToggleIconButton extends IconButton {
  constructor(inits?: IToggleIconButtonInits) {
    super({ ...inits, checkable: true });
  }

  override onClick(cb: (self: ToggleIconButton) => void): ToggleIconButton {
    this.cb = cb as any;
    return this;
  }
}
