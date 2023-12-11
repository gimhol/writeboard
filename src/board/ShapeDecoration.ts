import { Shape, ShapeData } from "../shape";

export interface IShapeDecoration {
  ghost?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  locked?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  selected?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  resizable?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  debug?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
}
export class DefaultShapeDecoration implements IShapeDecoration {
  
  // debug(shape: Shape, ctx: CanvasRenderingContext2D){
  //   const { x, y, w, h } = shape.boundingRect()
  //   ctx.fillStyle = "#00FF0033"
  //   ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
  // }

  locked(shape: Shape, ctx: CanvasRenderingContext2D) {
    // 虚线会损耗性能
    const lineWidth = 2
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()

    ctx.strokeStyle = '#ffffff88'
    ctx.setLineDash([])
    ctx.stroke()
    ctx.strokeStyle = '#00000088'
    ctx.setLineDash([lineWidth * 8])
    ctx.stroke()
  }

  selected(shape: Shape, ctx: CanvasRenderingContext2D) {
    // 虚线会损耗性能
    const lineWidth = 1
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()

    ctx.strokeStyle = '#ffffff'
    ctx.setLineDash([])
    ctx.stroke()
    ctx.strokeStyle = '#000000'
    ctx.setLineDash([lineWidth * 4])
    ctx.stroke()
  }

  resizable(shape: Shape, ctx: CanvasRenderingContext2D) {
    let { x, y, w, h } = shape.selectorRect()
    ctx.fillStyle = 'white'
    ctx.setLineDash([]);
    const {
      s, lx, rx, ty, by, mx, my,
    } = shape.getResizerNumbers(x, y, w, h)

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