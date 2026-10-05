# Custom Tool

[简体中文](./custom-tool.md) | English

Back to [docs index](./README.en.md)

A tool translates **pointer events into shape operations**. `Board` converts DOM events into world coordinates and calls the active tool:

```
pointerdown(left)     → tool.pointerDown(dot)   also emits ToolDown
pointermove(held)     → tool.pointerDraw(dot)   also emits ToolDraw
pointermove(free)     → tool.pointerMove(dot)   also emits ToolMove
pointerup(left)       → tool.pointerUp(dot)     also emits ToolUp
repaint               → tool.render(octx)       draws the tool's own visuals (preview, cursor …)
```

## 1. The ITool interface

```ts
export interface ITool {
  /** tool type, must match the type used in Gaia.registerTool() */
  get type(): ToolType
  get board(): Board | undefined
  set board(v: Board | undefined)

  /** called when this tool becomes the active tool (good place for window listeners) */
  start?(): void
  /** called when switching away (remove listeners, clear previews) */
  end?(): void

  /** pointer in world coordinates plus pressure: { x, y, p } */
  pointerDown?(dot: IDot): void
  /** moving with the left button held */
  pointerDraw?(dot: IDot): void
  /** moving without a button held */
  pointerMove?(dot: IDot): void
  pointerUp?(dot: IDot): void

  /** repaint hook; ctx is already translated into world space */
  render?(ctx: CanvasRenderingContext2D): void
}
```

Key points:

- **All callbacks are optional** — implement only what you need.
- `dot` is already in **world coordinates** (`Board.getDot()` maps it), so it compares directly with `shape.data.x/y`; `dot.p` is pressure (0.5 for mice).
- `Board.setToolType(type)` creates the instance via `factory.newTool(type)`, then sets `tool.board` and calls `start()`; switching away calls `end()` on the old tool first.
- Only the **left button** reaches tools; the middle button pans the board, other buttons do nothing.
- An unregistered type does not throw: it falls back to `InvalidTool` (a no-op) with a console warning.

## 2. Route A: reuse SimpleTool (drag to create)

The built-in `SimpleTool` already implements press → drag → release (including `Ctrl/Alt/Shift` constraints and the correct `ShapesGeoChanging/GeoChanged/ShapesDone` emissions). All you do is bind it to a shape type:

```ts
// triangle/Tool.ts
import { Gaia, SimpleTool } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "./Data"

/** custom tool type, also a string */
export const TOOL_TRIANGLE = 'TOOL_TRIANGLE'

Gaia.registerTool(
  TOOL_TRIANGLE,
  () => new SimpleTool(TOOL_TRIANGLE, SHAPE_TRIANGLE),
  { name: 'Triangle', desc: 'drag to create a triangle', shape: SHAPE_TRIANGLE },
)
```

Usage:

```ts
import { TOOL_TRIANGLE } from "./triangle/Tool"

board.setToolType(TOOL_TRIANGLE)   // then drag on the board to draw triangles
```

What `SimpleTool` does (i.e. the minimum a creating tool must do):

1. `pointerDown`: `factory.newShape(shapeType)`, set `data.layer`, then `board.add(shape, true)`;
2. `pointerDraw` / `pointerUp`: update geometry with `shape.geo(x, y, w, h)`;
3. On release it emits `ShapesGeoChanged` and `ShapesDone`, which makes **undo/redo and recording** work.

## 3. Route B: fully custom tool

This “stamp” tool shows a dashed preview while hovering and stamps a triangle where you click:

```ts
// stamp/Tool.ts
import { EventEnum, Gaia, Rect, type Board, type IDot, type IRect, type ITool } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "../triangle/Data"

export const TOOL_STAMP = 'TOOL_STAMP'

export class StampTool implements ITool {
  get type() { return TOOL_STAMP }   // must match the registered type, otherwise the factory warns

  private _board: Board | undefined
  private _size = 80
  private _hover = new Rect(0, 0, 0, 0) // preview rect in world coordinates

  get board() { return this._board }
  set board(v) { this._board = v }

  /** clear the preview when switching away */
  end(): void {
    const board = this._board
    if (!board) return
    if (this._hover.w) board.markDirty(this._dirtyRect())
    this._hover.x = this._hover.y = this._hover.w = this._hover.h = 0
  }

  /** follow the pointer while not pressed */
  pointerMove(dot: IDot): void {
    this.moveHoverTo(dot)
  }

  /** stamp on left button down */
  pointerDown(dot: IDot): void {
    const board = this._board
    if (!board) return
    this.moveHoverTo(dot)

    const shape = board.factory.newShape(SHAPE_TRIANGLE)
    shape.data.layer = board.layer().id      // must point to an existing layer, see gotchas
    board.add(shape, true)                   // emits ShapesAdded with operator = board.whoami
    shape.geo(this._hover.x, this._hover.y, this._size, this._size)

    // emit ShapesDone so ActionQueue records it as an undoable action
    board.emit(EventEnum.ShapesDone, { operator: board.whoami, shapeDatas: [shape.data.copy()] })
  }

  pointerUp(): void { /* click-to-stamp needs nothing here */ }

  /** draw in world coordinates (ctx is already translated) */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this._hover.w) return
    const { x, y, w, h } = this._hover
    ctx.save()
    ctx.setLineDash([4, 4])
    ctx.strokeStyle = 'rgba(0, 0, 0, .4)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, w, h)
    ctx.restore()
  }

  private moveHoverTo(dot: IDot) {
    const board = this._board
    if (!board) return
    const hadHover = this._hover.w > 0
    const prev = this._dirtyRect()
    this._hover.x = dot.x - this._size / 2
    this._hover.y = dot.y - this._size / 2
    this._hover.w = this._size
    this._hover.h = this._size
    if (hadHover) board.markDirty(prev)   // erase the previous frame's preview
    board.markDirty(this._dirtyRect())    // paint the new preview
  }

  /**
   * Dirty rect of the preview: a 1px stroke overhangs half a pixel on each side,
   * so inflate the rect accordingly or moving the preview leaves residue behind.
   */
  private _dirtyRect(): IRect {
    const { x, y, w, h } = this._hover
    const pad = Math.ceil(1 / 2)          // 1px stroke → pad by 1px
    return { x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2 }
  }
}

Gaia.registerTool(TOOL_STAMP, () => new StampTool(), {
  name: 'Stamp',
  desc: 'click to stamp a triangle',
  shape: SHAPE_TRIANGLE,
})
```

```ts
board.setToolType(TOOL_STAMP)
```

> To draw your own graphics (an eraser cursor, for example), use a `Shape` subclass as an indicator like `EraserTool` does, paint it in `render()` and `markDirty()` as it moves — see [writeboard/tools/eraser](../writeboard/tools/eraser).

## 4. Events, undo & recording

### 4.1 Built-in events

| Event | When | Undo support via ActionQueue |
|---|---|---|
| `ShapesAdded` / `ShapesRemoved` | add & remove | only `ShapesRemoved` |
| `ShapesChanging` / `ShapesChanged` | batched property (style …) changes | — |
| `ShapesDone` | an operation completed | ✅ (undo = remove, redo = recreate) |
| `ShapesGeoChanging` / `ShapesGeoChanged` | geometry changing / changed | ✅ (only when `tool === ToolEnum.Selector`) |
| `ShapesSelected` / `ShapesDeselected` | selection changed | — |
| `ToolChanged` `LayerAdded` `LayerRemoved` `ViewportChanged` `WorldRectChanged` | board state changed | — |
| `ToolDown` `ToolMove` `ToolDraw` `ToolUp` | pointer events (debugging, external sync) | — |

How to emit: `board.emit(EventEnum.ShapesDone, { operator: board.whoami, shapeDatas: [...] })`.
Passing `true` as the last argument (`board.add(shape, true)`, `board.remove(shape, true)`, `board.scroll_by(x, y, true)`) is shorthand for “emit with `board.whoami` as the operator”.

### 4.2 Undo / redo

```ts
import { ActionQueue } from "@fimagine/writeboard"

const queue = new ActionQueue().setActor(board) // starts recording events registered in Gaia.listActions()

queue.undo()
queue.redo()
queue.canUndo   // can undo
queue.canRedo   // can redo
```

Two rules decide whether your tool's changes can be undone:

1. **`operator` must equal `board.whoami`** — `ActionQueue` ignores other operators' events (useful in collaboration to record only your own edits).
2. **Emit events that have a registered action**: the ones in `Gaia.listActions()`. `ShapesDone`, `ShapesRemoved` and `ShapesGeoChanged` are registered already, so reusing them is the easiest path.

### 4.3 Custom events (advanced)

If your tool needs its own event type (say “stamped”, carrying extra business meaning), register your own undo/redo handlers:

```ts
import { Gaia, type Board } from "@fimagine/writeboard"

export const MyEvent = { Stamped: 'MY_TOOL_STAMPED' } as const

Gaia.registAction(MyEvent.Stamped, {
  isAction: () => true,
  undo: (board: Board, detail: { shapeDatas: { i: string }[] }) => {
    const shapes = detail.shapeDatas.map(d => board.find(d.i)).filter(v => !!v)
    board.remove(shapes, { operator: 'action_queue' })
  },
  redo: (board: Board, detail: { shapeDatas: { i: string }[] }) => {
    const shapes = detail.shapeDatas.map(d => board.factory.newShape(d))
    board.add(shapes, { operator: 'action_queue' })
  },
})

// inside the tool:
// board.emit(MyEvent.Stamped as any, { operator: board.whoami, shapeDatas: [...] } as any)
```

> `Board.emit()` only accepts keys declared in `Events.IDetailMap`; if extending it is inconvenient, cast as shown above. **Reusing built-in events is preferred** — undo, redo and recording all come for free.

### 4.4 Recording & playback

`Recorder.start()` subscribes to **every built-in event in `EventEnum`**, therefore:

- Tools built on built-in events (including `SimpleTool`) are recordable/playable out of the box (`Recorder` → `getJson()` → `Player`);
- Operations that only emit custom events are **not recorded into screenplays** (see [demo/RecorderView.ts](../demo/RecorderView.ts)).

## 5. Registry

```ts
Gaia.registerTool(type, creator, info?)  // info: { name?, desc?, shape? }; shape = the shape type this tool produces
Gaia.overrideTool(type, creator?, info?)
Gaia.listTools()
Gaia.toolInfo(type)                      // { name, desc, shape }
Gaia.editToolInfo(type, info => ({ ...info, name: 'new name' }))
```

- A tool whose `type` differs from the registered type logs `is not corrent! check member 'type' of your Tool!`.

## 6. Gotchas

1. **Not registering**: `board.setToolType('TOOL_XXX')` silently becomes `InvalidTool` (console warning only).
2. **Wrong `type`**: tools report events with their own `type` (e.g. `ShapesGeoChanged.tool`); a mismatch breaks undo logic.
3. **No cleanup in `end()`**: remove window listeners added in `start()` and `markDirty()` the preview away, or it stays on the canvas.
4. **Mixing coordinate spaces**: `dot` is world space, so are `aabb()` and `data.x/y`; only `path(ctx)` / `render(ctx)` use shape-local coordinates.
5. **Missing `markDirty()`**: call `board.markDirty(rect)` after preview or data changes; the board never repaints everything by itself.
6. **Pad dirty rects by the stroke overhang**: with `strokeRect(x + 0.5, y + 0.5, w, h)` and a 1px line width, painted pixels reach `x + w` / `y + h`; marking only `w × h` leaves **residue** (visible as soon as a later, larger dirty rect composites that column). Inflate by 1px (or `ceil(lineWidth / 2)`) — the same margin `Shape.aabb()` reserves for `lineWidth`.
7. **Shape without `data.layer`**: the created shape is never rendered (same trap as custom shapes).
8. **Hidden pages do not repaint**: rendering uses `requestAnimationFrame`, which browsers suspend for background tabs.
