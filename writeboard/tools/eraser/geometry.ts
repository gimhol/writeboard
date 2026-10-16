import { ShapeEnum, ShapePen, type LinesData, type Shape } from "../../shape"

const SAMPLES = 24

interface IDot { x: number; y: number }

type Cmd =
  | { t: 'move'; p: IDot }
  | { t: 'line'; p: IDot }
  | { t: 'quad'; c: IDot; p: IDot }
  | { t: 'cubic'; c0: IDot; c1: IDot; p: IDot }

const recordPath = (shape: Shape): Cmd[] => {
  const cmds: Cmd[] = []
  const ctx = {
    beginPath: () => { },
    closePath: () => { },
    moveTo: (x: number, y: number) => { cmds.push({ t: 'move', p: { x, y } }) },
    lineTo: (x: number, y: number) => { cmds.push({ t: 'line', p: { x, y } }) },
    quadraticCurveTo: (x1: number, y1: number, x: number, y: number) => {
      cmds.push({ t: 'quad', c: { x: x1, y: y1 }, p: { x, y } })
    },
    bezierCurveTo: (x1: number, y1: number, x2: number, y2: number, x: number, y: number) => {
      cmds.push({ t: 'cubic', c0: { x: x1, y: y1 }, c1: { x: x2, y: y2 }, p: { x, y } })
    },
  } as unknown as CanvasRenderingContext2D
  ;(shape as unknown as { path(ctx: CanvasRenderingContext2D): void }).path(ctx)
  return cmds
}

const pushWorld = (out: number[], shape: Shape, x: number, y: number) => {
  const v = shape.map2world(x, y)
  out.push(v.x, v.y)
}

const pushCurve = (out: number[], shape: Shape, p0: IDot, c0: IDot | undefined, c1: IDot | undefined, p1: IDot) => {
  for (let i = 1; i <= SAMPLES; ++i) {
    const t = i / SAMPLES
    const u = 1 - t
    let x: number
    let y: number
    if (c0 && c1) {
      const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t
      x = a * p0.x + b * c0.x + c * c1.x + d * p1.x
      y = a * p0.y + b * c0.y + c * c1.y + d * p1.y
    } else if (c0) {
      const a = u * u, b = 2 * u * t, c = t * t
      x = a * p0.x + b * c0.x + c * p1.x
      y = a * p0.y + b * c0.y + c * p1.y
    } else {
      x = u * p0.x + t * p1.x
      y = u * p0.y + t * p1.y
    }
    pushWorld(out, shape, x, y)
  }
}

const pathPolylines = (shape: Shape): number[][] => {
  const polys: number[][] = []
  let out: number[] | undefined = void 0
  let cur: IDot | undefined = void 0
  for (const cmd of recordPath(shape)) {
    if (cmd.t === 'move') {
      out = []
      polys.push(out)
      pushWorld(out, shape, cmd.p.x, cmd.p.y)
      cur = cmd.p
      continue
    }
    if (!out || !cur) continue
    if (cmd.t === 'line') pushWorld(out, shape, cmd.p.x, cmd.p.y)
    else if (cmd.t === 'quad') pushCurve(out, shape, cur, cmd.c, void 0, cmd.p)
    else pushCurve(out, shape, cur, cmd.c0, cmd.c1, cmd.p)
    cur = cmd.p
  }
  return polys
}

const lineWorldCoords = (data: LinesData): number[] | null => {
  const u = data.coords
  if (u.length < 4) return null
  let minX = u[0]
  let minY = u[1]
  for (let i = 2; i < u.length; i += 2) {
    if (u[i] < minX) minX = u[i]
    if (u[i + 1] < minY) minY = u[i + 1]
  }
  const ox = data.x - minX
  const oy = data.y - minY
  const out: number[] = new Array(u.length)
  for (let i = 0; i < u.length; i += 2) {
    out[i] = u[i] + ox
    out[i + 1] = u[i + 1] + oy
  }
  return out
}

/**
 * 把图形换算成「可擦几何」——世界坐标下的折线，可以有好几段；
 * 目前只支持画笔 / 直线 / 钩 / 叉，其它图形返回 null（擦不掉）
 *
 * Turns a shape into the geometry the eraser can cut: world-coordinate polylines, one or
 * more of them. Only pen / lines / tick / cross are supported for now and every other
 * shape returns null (it can not be erased).
 *
 * @param {Shape} shape 要换算的图形 / The shape to convert
 * @return {number[][] | null} 世界坐标折线（每段是一串 x, y, ... 坐标）/ World-coordinate polylines (each one a flat list of x, y, ... coordinates), or null
 */
export const worldPolylines = (shape: Shape): number[][] | null => {
  if (ShapePen.is(shape)) return [shape.data.coords2world]
  if (shape.type === ShapeEnum.Lines) {
    const coords = lineWorldCoords(shape.data as LinesData)
    return coords ? [coords] : null
  }
  if (shape.type === ShapeEnum.Tick || shape.type === ShapeEnum.Cross) {
    const polys = pathPolylines(shape)
    return polys.length ? polys : null
  }
  return null
}
