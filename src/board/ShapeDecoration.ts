import { Resizable, Shape, ShapeData } from "../shape";

export interface IShapeDecoration {
  ghost?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  locked?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  selected?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  resizable?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  debug?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
}
export class DefaultShapeDecoration implements IShapeDecoration {

  private dashSroke(ctx: CanvasRenderingContext2D, segments: Iterable<number>) {
    ctx.strokeStyle = 'white'
    ctx.setLineDash([])
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.setLineDash(segments)
    ctx.stroke()
  }

  // debug(shape: Shape, ctx: CanvasRenderingContext2D){
  //   const { x, y, w, h } = shape.boundingRect()
  //   ctx.fillStyle = "#00FF0033"
  //   ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
  // }

  locked(shape: Shape, ctx: CanvasRenderingContext2D) {
    const lineWidth = 2
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()

    this.dashSroke(ctx, [lineWidth * 8])
  }

  selected(shape: Shape, ctx: CanvasRenderingContext2D) {
    const lineWidth = 1
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    this.dashSroke(ctx, [lineWidth * 4])
  }

  resizable(shape: Shape, ctx: CanvasRenderingContext2D) {
    let { x, y, w, h } = shape.selectorRect()
    ctx.fillStyle = 'white'
    ctx.setLineDash([]);
    const {
      s, lx, rx, ty, by, mx, my,
    } = shape.getResizerNumbers(x, y, w, h)
    const { resizable } = shape

    if (resizable & Resizable.Vertical) {
      // top resizer
      ctx.beginPath()
      ctx.rect(mx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom resizer
      ctx.beginPath()
      ctx.rect(mx, by, s, s)
      ctx.fill()
      ctx.stroke()
    }

    if (resizable & Resizable.Horizontal) {
      // left resizer
      ctx.beginPath()
      ctx.rect(lx, my, s, s)
      ctx.fill()
      ctx.stroke()

      // right resizer
      ctx.beginPath()
      ctx.rect(rx, my, s, s)
      ctx.fill()
      ctx.stroke()
    }
    if (resizable & Resizable.Corner) {
      // top-left resizer
      ctx.beginPath()
      ctx.rect(lx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // top-right resizer
      ctx.beginPath()
      ctx.rect(rx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom-left resizer
      ctx.beginPath()
      ctx.rect(lx, by, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom-right resizer
      ctx.beginPath()
      ctx.rect(rx, by, s, s)
      ctx.fill()
      ctx.stroke()
    }
  }
}