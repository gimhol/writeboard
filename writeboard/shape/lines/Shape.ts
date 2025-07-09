import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { Shape } from "../base"
import { LinesData } from "./Data"
import { IRect } from "../../utils/IRect"
import { IDot } from "../../utils/Dot"

export class ShapeLines extends Shape<LinesData> {
  private _srcGeo: IRect | null = null
  private _path2D = new Path2D();

  constructor(data: Partial<LinesData>) {
    super(data, LinesData);
    let x, y: number
    for (let i = 0; i < this.data.coords.length; i += 2) {
      x = this.data.coords[i]
      y = this.data.coords[i + 1]
      this.updatePath(x, y, i === 0 ? 'first' : undefined);
    }
    this.updateSrcGeo()
  }

  override merge(data: Partial<LinesData>) {
    const prev = this.data.copy()
    this.beginDirty(prev)
    const startIdx = this.data.coords.length
    this.data.merge(data)
    const endIdx = this.data.coords.length - 1
    if (startIdx !== endIdx) {
      let x, y: number
      for (let i = startIdx; i <= endIdx; i += 2) {
        x = this.data.coords[i]
        y = this.data.coords[i + 1]
        this.updatePath(x, y, i === 0 ? 'first' : undefined);
      }
    }
    this.updateSrcGeo()
    this.endDirty(prev)
  }

  /**
   * 计算原始矩形
   * @param dot 
   */
  private updateSrcGeo(): IRect {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    for (let i = 0; i < this.data.coords.length; i += 2) {
      const x = this.data.coords[i];
      const y = this.data.coords[i + 1];
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
    this._srcGeo = {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    }
    return this._srcGeo
  }

  private updatePath(x: number, y: number, type?: 'first') {
    if (type === 'first') {
      this._path2D.moveTo(x, y);
    } else {
      this._path2D.lineTo(x, y);
    }
  }

  pushDot(dot: IDot, type?: 'first'): void {
    this.data.coords.push(dot.x, dot.y)
    const geo = this.updateSrcGeo()
    this.updatePath(dot.x, dot.y, type)
    this.geo(geo.x, geo.y, geo.w, geo.h)
    this.endDirty()
  }

  editDot(dot: IDot): void {
    this.data.coords[this.data.coords.length - 2] = dot.x;
    this.data.coords[this.data.coords.length - 1] = dot.y;
    this._path2D = new Path2D();
    for (let i = 0; i < this.data.coords.length; i += 2) {
      const x = this.data.coords[i];
      const y = this.data.coords[i + 1];
      this.updatePath(x, y, i === 0 ? 'first' : undefined)
    }
    const geo = this.updateSrcGeo();
    this.geo(geo.x, geo.y, geo.w, geo.h);
    this.endDirty();
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) { return; }
    const d = this.data;

    if (d.lineWidth && d.strokeStyle && this._srcGeo) {
      ctx.save()
      ctx.translate(
        this.data.x - this._srcGeo.x,
        this.data.y - this._srcGeo.y
      )
      ctx.lineCap = d.lineCap
      ctx.lineDashOffset = d.lineDashOffset || 0
      ctx.lineJoin = d.lineJoin
      ctx.lineWidth = d.lineWidth || 0
      ctx.miterLimit = d.miterLimit || 0
      ctx.strokeStyle = d.strokeStyle
      ctx.setLineDash(d.lineDash)
      ctx.stroke(this._path2D)
      ctx.restore()
    }
    super.render(ctx);
  }
}

Gaia.registerShape(ShapeEnum.Lines, () => new LinesData, d => new ShapeLines(d))