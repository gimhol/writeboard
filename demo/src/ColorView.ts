import { Button, ButtonInits, ButtonStyleNames } from "./G/BaseView/Button";
import { ButtonGroup } from "./G/Helper/ButtonGroup";
import { Canvas } from "./G/BaseView/Canvas";
import { NumberInput } from "./G/BaseView/NumberInput";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/Subwin";
import { RGBA } from "./colorPalette/Color";
import { ColorPalette } from "./colorPalette/ColorPalette";
enum ColorKind {
  Line = 'Line',
  Fill = 'Fill'
}
interface ColorKindButtonInits extends ButtonInits {
  kind: ColorKind;
  defaultColor: RGBA;
}
class ColorKindButton extends Button {
  private _kind?: ColorKind;
  private _colorBrick?: View<"div">;
  public get kind() { return this._kind; }
  public set color(v: RGBA) { this._colorBrick?.styles.apply('_', old => ({ ...old, background: '' + v })) }
  constructor() {
    super();
  }
  override init(inits?: ColorKindButtonInits | undefined): this {
    super.init(inits);
    this._kind = inits?.kind;
    this.styles.apply('normal', v => ({
      ...v,
      paddingLeft: 5,
      paddingRight: 5,
    }))

    const content = new View('div');
    content.styles.apply('_', {
      display: 'inline-flex',
      alignItems: 'center',
      color: 'white'
    })
    content.inner.append(inits?.kind + ' ')

    this._colorBrick = new View('div');
    this._colorBrick.styles.apply('_', {
      marginLeft: 5,
      background: '' + inits?.defaultColor,
      width: 16,
      height: 16,
    })
    content.addChild(this._colorBrick)
    this.content = content;
    this.editStyle(false, true, false, this.styles.read(ButtonStyleNames.Hover) || {})
    return this;
  }
}
export enum ColorViewEventTypes {
  LineColorChange = 'linecolorchange',
  FillColorChange = 'fillcolorchange',
}

export default class ColorView extends Subwin {
  static EventTypes = ColorViewEventTypes;
  private _inputs = {
    r: new ColorNumInput(),
    g: new ColorNumInput(),
    b: new ColorNumInput(),
    a: new ColorNumInput(),
  } as const;

  private _editing = ColorKind.Line;
  private _colors: Record<ColorKind, RGBA> = {
    [ColorKind.Line]: new RGBA(255, 255, 255, 255),
    [ColorKind.Fill]: new RGBA(100, 100, 100, 255)
  };

  private _btnColors: Record<ColorKind, ColorKindButton> = {
    [ColorKind.Line]: new ColorKindButton().init({ checkable: true, kind: ColorKind.Line, defaultColor: this._colors[ColorKind.Line] }),
    [ColorKind.Fill]: new ColorKindButton().init({ checkable: true, kind: ColorKind.Fill, defaultColor: this._colors[ColorKind.Fill] })
  }

  private _colorPalette: ColorPalette;
  private setEditingColor(v?: ColorKind) {
    if (!v) { return }
    this._editing = v;
    this._colorPalette.value = this._colors[this._editing];
  }

  constructor() {
    super();

    this.header.title = 'color';
    this.styles.apply('_', {});
    this.content = new View('div');
    this.content.styles.apply('_', {
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      minWidth: '250px',
      minHeight: '200px',
    });

    const currentColorWrapper = new View('div');
    currentColorWrapper.styles.apply('_', {
      display: 'flex',
      padding: '5px 5px',
    })
    this.content.addChild(currentColorWrapper);

    currentColorWrapper.addChild(this._btnColors.Line, this._btnColors.Fill);
    const buttonGroup = new ButtonGroup<ColorKindButton>({
      buttons: [this._btnColors.Line, this._btnColors.Fill]
    })
    buttonGroup.onClick = btn => this.setEditingColor(btn?.kind);

    const canvasWrapper = new View('div');
    canvasWrapper.styles.apply('_', {
      flex: 1,
      position: 'relative',
    });
    this.content.addChild(canvasWrapper);

    const canvas = new Canvas();
    canvas.draggable = false;
    canvas.width = 1;
    canvas.height = 1;
    canvas.styles.apply('_', {
      position: 'absolute',
      left: '10px',
      right: '10px',
      userSelect: 'none',
    })
    canvasWrapper.addChild(canvas);

    this._colorPalette = new ColorPalette(canvas.inner);
    this._colorPalette.value = this._colors[this._editing];

    new ResizeObserver(entries => entries.forEach(entry => {
      canvas.width = Math.max(1, entry.contentRect.width - 20);
      canvas.height = Math.max(1, entry.contentRect.height);
      this._colorPalette.update();
    })).observe(canvasWrapper.inner);

    const inputWrapper = new View('div');
    inputWrapper.styles.apply('_', {
      display: 'grid',
      padding: '0px 5px',
      gridTemplateColumns: 'repeat(4, 10px auto)',
      fontSize: 12,
      color: 'white',
      alignItems: 'center',
    });
    this.content.addChild(inputWrapper);

    (['r', 'g', 'b', 'a'] as const).forEach(n => {
      this._inputs[n].onChange((s) => {
        const color = this._colorPalette.value.copy();
        color[n] = s.num;
        this._colorPalette.value = color;
      });
      inputWrapper.inner.append(n.toUpperCase() + ':');
      inputWrapper.addChild(this._inputs[n]);
    });

    this._colorPalette.onChanged = v => {
      this._colors[this._editing] = v.copy();
      this._inputs.r?.setNum(v.r);
      this._inputs.g?.setNum(v.g);
      this._inputs.b?.setNum(v.b);
      this._inputs.a?.setNum(v.a);

      this._btnColors[this._editing].color = v;
      switch (this._editing) {
        case ColorKind.Line:
          this._inner.dispatchEvent(new CustomEvent(ColorViewEventTypes.LineColorChange, { detail: v }))
          break;
        case ColorKind.Fill:
          this._inner.dispatchEvent(new CustomEvent(ColorViewEventTypes.FillColorChange, { detail: v }))
          break;
      }
    };
    this.removeChild(this.footer);
  }
}

class ColorNumInput extends NumberInput {
  constructor() {
    super();
    this.max = 255;
    this.min = 0;
    this.styles.apply('_', {
      minWidth: 0,
      flex: 1,
      background: 'transparent',
      color: 'white',
      border: 'none',
      outline: 'none',
      borderRadius: 5,
      margin: '5px 5px 3px 5px',
      fontSize: 12
    });
  }
}