import { Board, Shape, ShapeData, ShapeEnum, ShapePen } from "../writeboard";
import { Button } from "./G/BaseView/Button";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";


const v255 = () => Math.floor(Math.random() * 255);
const rColor = () => `rgb(${v255()},${v255()},${v255()})`;

export class ToyView extends Subwin {
  private _board?: () => Board;
  get board() { return this._board; }
  set board(v) { this._board = v; }

  constructor() {
    super();
    this.header.title = 'toys';
    this.content = new View('div');
    this.content.styles.apply('', {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    })

    const randomShapeItem = (item: Shape<ShapeData>) => {
      const board = this._board?.();
      if (!board) { return; }
      item.geo(
        Math.floor(Math.random() * board.width),
        Math.floor(Math.random() * board.height),
        50, 50
      )
      item.data.fillStyle = rColor();
      item.data.strokeStyle = rColor();
    }

    this.content.addChild(new Button().init({
      content: 'random add 1000 rect'
    }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }
      const items: Shape[] = []
      for (let i = 0; i < 1000; ++i) {
        const item = board.factory.newShape(ShapeEnum.Rect)
        item.data.layer = board.layer().id;
        randomShapeItem(item);
        items.push(item)
      }
      board.add(items, true)
    }))

    this.content.addChild(new Button().init({
      content: 'random add 1000 oval'
    }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }
      const items: Shape[] = []
      for (let i = 0; i < 1000; ++i) {
        const item = board.factory.newShape(ShapeEnum.Oval)
        item.data.layer = board.layer().id;
        randomShapeItem(item);
        items.push(item)
      }
      board.add(items, true)
    }))

    this.content.addChild(new Button().init({
      content: 'random draw 1000 pen'
    }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }
      const items: Shape[] = []
      for (let i = 0; i < 1000; ++i) {
        const item = board.factory.newShape(ShapeEnum.Pen) as ShapePen
        item.data.layer = board.layer().id;
        let x = Math.floor(Math.random() * board.width!);
        let y = Math.floor(Math.random() * board.height!);
        const v5 = () => Math.floor(Math.random() * 5)
        const lenth = Math.floor(Math.random() * 100)
        for (let j = 0; j < lenth; ++j) {
          x += v5();
          y += v5();
          item.appendDot({ x, y }, 'mid')
        }
        randomShapeItem(item);
        items.push(item)
      }
      board.add(items, true)
    }))
  }
}
