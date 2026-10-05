# Custom Shape

[简体中文](./custom-shape.md) | English

Back to [docs index](./README.en.md)

A shape in writeboard is split into two layers, each with a single job:

| Layer | Base class | Responsibility |
|---|---|---|
| Data | `ShapeData` | What the shape **is**: type, geometry, rotation, style, status; defines what gets serialized |
| Render | `Shape` | How the shape is **drawn**: a path or fully custom code; bounds, hit-testing, selection box and resizable directions come from the base class |

Once both are registered in `Gaia`, `factory.newShape(type)`, snapshots and undo/redo will all know your shape.

## 1. Minimal example: triangle

Create a `triangle/` folder following the built-in layout: `Data.ts`, `Shape.ts`, `index.ts`.

### 1.1 Type identifier

Built-in shapes use the numeric `ShapeEnum`; **custom shapes use a string** (SCREAMING_CASE with a prefix is recommended):

```ts
export const SHAPE_TRIANGLE = 'SHAPE_TRIANGLE'
```

### 1.2 Data class

```ts
// triangle/Data.ts
import { ShapeData } from "@fimagine/writeboard"

export const SHAPE_TRIANGLE = 'SHAPE_TRIANGLE'

export class TriangleData extends ShapeData {
  constructor(other?: Partial<TriangleData>) {
    super()                       // do NOT write super(other), see Gotchas
    this.type = SHAPE_TRIANGLE    // must equal the registered type
    this.strokeStyle = '#ff5722'  // default style
    this.lineWidth = 4
    other && this.read(other)     // subclasses call read() themselves
  }
}
```

### 1.3 Shape class

Extend `ShapeNeedPath` and implement `path(ctx)` only — fill, stroke, rotation, scaling and the selection box are handled by the base class:

```ts
// triangle/Shape.ts
import { Gaia, ShapeNeedPath } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE, TriangleData } from "./Data"

export class ShapeTriangle extends ShapeNeedPath<TriangleData> {
  constructor(data: Partial<TriangleData>) {
    super(data, TriangleData)
  }

  /** draw a path in the shape-local coordinate system (origin = top-left of the shape) */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath()
    ctx.moveTo(x + w / 2, y)      // apex
    ctx.lineTo(x + w, y + h)      // bottom right
    ctx.lineTo(x, y + h)          // bottom left
    ctx.closePath()
  }
}

// register: type → data creator → shape creator
Gaia.registerShape(SHAPE_TRIANGLE, () => new TriangleData(), d => new ShapeTriangle(d), {
  name: 'Triangle',
  desc: 'triangle shape',
})
```

> The registration statement lives at module top level and takes effect once the module is imported (built-ins do the same, see [writeboard/shape/rect](../writeboard/shape/rect)).

## 2. Create & show

```ts
import { FactoryEnum, Gaia } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "./triangle/Data"
import "./triangle/Shape"                    // side effect: runs Gaia.registerShape()

const factory = Gaia.factory(FactoryEnum.Default)()
const board = factory.newBoard({ element: container, width: 500, height: 500 })

const tri = factory.newShape(SHAPE_TRIANGLE) // id and z are assigned automatically
tri.data.layer = board.layer().id            // required: shapes are only painted on an existing layer
board.add(tri, true)                         // true → emits ShapesAdded with board.whoami as operator
tri.geo(100, 100, 120, 100)                  // x, y, w, h; marks dirty and repaints
```

Key points:

- After `board.add()` the shape gets its `board`, so dirty-marking methods such as `geo()` actually repaint.
- `data.layer` must be an existing layer id, otherwise `Board.render()` skips it (**the #1 reason a shape is invisible**).
- To let users create it by dragging, use `SimpleTool` from the [custom tool guide](./custom-tool.en.md).

## 3. ShapeData in depth

### 3.1 Base fields

`ShapeData` stores short keys (smaller JSON) and exposes readable getters/setters:

| Key | getter | Description |
|---|---|---|
| `t` | `type` | Shape type: `ShapeEnum` or a custom string |
| `i` | `id` | Unique id, assigned by `factory.newShape()` |
| `x` `y` `w` `h` | `x` `y` `w` `h` | Position and size in world coordinates |
| `z` | `z` | Z-order, larger is on top |
| `r` | `rotation` | Rotation in radians |
| `c` `d` | `scaleX` `scaleY` | Scale, defaults to 1 (not serialized when 1) |
| `l` | `layer` | Owning layer id |
| `g` | `groupId` | Group id |
| `a` | `style` | Style, see 3.3 |
| `b` | `status` | Status, see 3.3 |

There is also a set of read-only helpers: `left/right/top/bottom`, `midX/midY`, `halfW/halfH`, plus 16 corner/edge points such as `topLeft` and `rotatedMidTop` on `Shape`.

### 3.2 Custom fields

Built-in shapes (`PenData.coords`, `PolygonData.dots`, `TextData.text` …) all follow the same recipe: **short key + `override read()` to deserialize**:

```ts
import { ShapeData } from "@fimagine/writeboard"

export class StarData extends ShapeData {
  /** custom field: number of points; a short key matches the built-in style */
  u: number = 5
  get points() { return this.u }
  set points(v: number) { this.u = v }

  constructor(other?: Partial<StarData>) {
    super()
    this.type = 'SHAPE_STAR'
    this.fillStyle = '#ffc107'
    other && this.read(other)
  }

  /** base read() only covers base fields, read custom ones yourself */
  override read(other: Partial<StarData>) {
    super.read(other)
    const { u = other.points } = other
    if (typeof u === 'number') this.u = u
    return this
  }
}
```

A custom field travels with `toJson()`, snapshots and undo as long as it is **JSON-serializable** (number, string, array, plain object) and **restored in `read()`**.

> For stricter typing, declare `interface IStarData extends IShapeData { u: number }` and `implements` it, like the built-ins do.

### 3.3 Style & status

Style (`data.style`): `fillStyle`, `strokeStyle`, `lineWidth`, `lineCap`, `lineJoin`, `lineDash`, `lineDashOffset`, `miterLimit`.

`ShapeNeedPath` fills when `fillStyle` is set and strokes when `lineWidth && strokeStyle` are set; subclasses can disable either with `get needFill()` / `get needStroke()` (`PenData` returns `needFill = false`).

Status (`data.status`): `visible`, `selected`, `editing`, `locked`, `ghost`.

- `ghost`: visible but not interactive (great for backgrounds); `locked`: visible and selectable but not editable by dragging.
- You do **not** draw these yourself — `Board.shapeDecoration` draws the selection box, handles and locked markers centrally.

## 4. Drawing

### 4.1 Path based (recommended): `ShapeNeedPath` + `path()`

Best for shapes describable by a single path — see the triangle above; built-in `Rect`/`Oval`/`Polygon`/`Tick`/`Cross`/`HalfTick` are written this way.

### 4.2 Fully custom: `Shape` + `override render()`

When you need multiple paths, gradients, images or text layout, extend `Shape` directly:

```ts
import { Gaia, Resizable, Shape } from "@fimagine/writeboard"
import { StarData } from "./Data"

export class ShapeStar extends Shape<StarData> {
  constructor(data: Partial<StarData>) {
    super(data, StarData)
    this.resizable = Resizable.All // default is Resizable.None (no handles)
  }

  override render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return
    this.beginDraw(ctx)   // save() + translate to the shape origin, apply rotation and scale
    this.drawStar(ctx)
    this.endDraw(ctx)     // restore()
    super.render(ctx)     // don't forget the selection box / handles / locked / ghost decorations
  }

  private drawStar(ctx: CanvasRenderingContext2D) {
    const d = this.data
    const { w, h } = this.drawingRect()
    const cx = w / 2, cy = h / 2
    const R = Math.min(w, h) / 2
    const r = R * 0.45
    const n = Math.max(3, Math.floor(d.points))
    ctx.beginPath()
    for (let i = 0; i < n * 2; i++) {
      const rad = i % 2 ? r : R
      const a = (Math.PI / n) * i - Math.PI / 2
      const x = cx + Math.cos(a) * rad
      const y = cy + Math.sin(a) * rad
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.closePath()
    if (d.fillStyle) { ctx.fillStyle = d.fillStyle; ctx.fill() }
    if (d.lineWidth && d.strokeStyle) {
      ctx.lineWidth = d.lineWidth
      ctx.strokeStyle = d.strokeStyle
      ctx.stroke()
    }
  }
}

Gaia.registerShape('SHAPE_STAR', () => new StarData(), d => new ShapeStar(d), { name: 'Star', desc: 'star shape' })
```

## 5. Geometry & hit-testing

| Need | API |
|---|---|
| Change geometry (auto dirty) | `geo(x, y, w, h)`, `move(x, y)`, `resize(w, h)`, `geoBy(dx, dy, dw, dh)`, `setGeo(rect)` |
| Rotation | `rotateTo(rad, x?, y?)`, `rotateBy(delta, x?, y?)` |
| Local drawing rect | `drawingRect()` → `{ x: 0, y: 0, w, h }` |
| Selection rect | `selectorRect()` |
| Axis-aligned bounds (used for dirty rects) | `aabb()` |
| Rotated bounds (used for hit-testing) | `obb()` |
| Coordinate mapping | `map2me(world coords)` / `map2world(local coords)` |
| Resizable directions | `this.resizable = Resizable.None / Horizontal / Vertical / Corner / All / <specific>` |

Hit-testing uses the **obb bounds** by default (`DefaultShapesMgr.is_hit()`), i.e. a point inside the shape's bounding box counts as a hit. For pixel-accurate tests, pass a predicate to `board.hit()` / `board.hits()`:

```ts
const shape = board.hit(rect, (s, r) => s.type === 'SHAPE_TRIANGLE' && /* your own precise test */ true)
```

## 6. Dirty rects

The board repaints incrementally through dirty rects, so **every `data` change must be marked dirty**:

```ts
const prev = this.data.copy()
this.beginDirty(prev)   // repaint the OLD area, dispatch StartDirty
this.data.rotation += 0.1
this.endDirty(prev)     // repaint the NEW area, dispatch EndDirty
```

- Built-in mutators such as `geo()` / `merge()` mark dirty automatically.
- Changing a custom field (e.g. `star.points = 7`) does not, so call `beginDirty/endDirty` yourself (or at least `this.markDirty()`).
- `aabb()` must cover everything you paint (stroke included), otherwise you get ghosting; the base class already adds `lineWidth` and `factory.overbound()` margins.
- If you call `board.markDirty(rect)` yourself (instead of going through `geo()`), remember to include the stroke overhang — see the gotchas in the [custom tool guide](./custom-tool.en.md#6-gotchas).

## 7. Serialization

```ts
shape.data.copy()      // shallow copy: use it in events and undo snapshots
shape.data.wash()      // strip empty fields for clean JSON
board.toJson()         // whole board (layers + all shapes)
board.fromJson(json)   // restore

board.factory.newShape(data)  // restore a shape from data; keeps existing i/z
```

- Prefer `shape.data.copy()` in event payloads so later edits cannot corrupt history (built-in tools do the same).
- `wash()` only cleans base fields; override it in your subclass if custom fields need the same treatment.

## 8. Gotchas

1. **`super()` then `read()`**: calling `super(other)` skips the subclass `read`; always write `super()` + `this.read(other)`.
2. **`data.type` must equal the registered type**, otherwise `factory.newShape()` logs `is not corrent! check member 'type' of your ShapeData!` (the same warning exists for the shape class).
3. **Do not name the type constant like the shape class**: two symbols named `ShapeX` cause `TS2440: Import declaration conflicts with local declaration`. Use SCREAMING_CASE for constants.
4. **Forgetting to register** leaves you with the base `ShapeData` + base `Shape` and a `... is not registered` warning.
5. **Registering module never runs**: if you only import `Data.ts` while the registration lives in `Shape.ts`, nothing gets registered — an `index.ts` re-exporting the folder avoids this.
6. **`data.layer` is not a valid layer id**: the shape is silently skipped by the renderer (hardest case to debug).
7. **Data changed without marking dirty**: the canvas will not update, see section 6.
8. **Nothing repaints while the page is hidden**: rendering is driven by `requestAnimationFrame`, which browsers suspend for background tabs.
