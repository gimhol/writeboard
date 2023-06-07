import { IconButton, IconButtonInits } from "./IconButton";

export interface IToggleIconButtonInits extends IconButtonInits { }

export class ToggleIconButton extends IconButton {
  constructor(inits?: IToggleIconButtonInits) {
    super({ ...inits, checkable: true });
  }
}
