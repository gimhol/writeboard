# 自定义工具

简体中文 | [English](./custom-tool.en.md)

返回 [文档目录](./README.md)

工具是「**指针事件 → 图形操作**」的翻译层。`Board` 负责把 DOM 事件换算成世界坐标，再回调当前工具：

```
pointerdown(左键) → tool.pointerDown(dot)   同时广播 ToolDown
pointermove(按住) → tool.pointerDraw(dot)   同时广播 ToolDraw
pointermove(松开) → tool.pointerMove(dot)   同时广播 ToolMove
pointerup(左键)   → tool.pointerUp(dot)     同时广播 ToolUp
重绘时            → tool.render(octx)       在离屏画布上画工具自己的东西（预览、光标…）
```

## 1. ITool 接口

```ts
export interface ITool {
  /** 工具类型，必须与 Gaia.registerTool() 注册时用的类型一致 */
  get type(): ToolType
  get board(): Board | undefined
  set board(v: Board | undefined)

  /** 被切换成当前工具时调用（适合挂 window 监听） */
  start?(): void
  /** 从当前工具切走时调用（适合移除监听、清理预览） */
  end?(): void

  /** 指针（世界坐标与压力值）：{ x, y, p } */
  pointerDown?(dot: IDot): void
  /** 按住左键移动 */
  pointerDraw?(dot: IDot): void
  /** 未按下时移动 */
  pointerMove?(dot: IDot): void
  pointerUp?(dot: IDot): void

  /** 重绘回调：ctx 已平移到世界坐标系 */
  render?(ctx: CanvasRenderingContext2D): void
}
```

要点：

- **所有回调都可选**，只实现你需要的即可。
- `dot` 已是**世界坐标**（`Board.getDot()` 内部做了 `map2world`），可直接与 `shape.data.x/y` 比较；`dot.p` 是压力值（鼠标默认 0.5）。
- 工具实例由 `Board.setToolType(type)` 通过工厂创建（`factory.newTool(type)`），随后 `tool.board = board`、`tool.start()`；切走时先 `旧工具.end()`、再创建新工具并 `start()`。
- 只处理**左键**：中键是板子的平移拖拽，其余按键不回调工具。
- 未注册的类型不会报错，而是退化成 `InvalidTool`（什么都不做）并打印警告。

## 2. 路线 A：复用 SimpleTool（拖拽创建）

内置的 `SimpleTool` 已经实现了「按下 → 拖动 → 抬起」的创建流程（含 `Ctrl/Alt/Shift` 的矩形约束，以及 `ShapesGeoChanging/GeoChanged/ShapesDone` 事件的正确广播），要做的只是把它绑定到一个图形类型上：

```ts
// triangle/Tool.ts
import { Gaia, SimpleTool } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "./Data"

/** 自定义工具类型：同样是字符串 */
export const TOOL_TRIANGLE = 'TOOL_TRIANGLE'

Gaia.registerTool(
  TOOL_TRIANGLE,
  () => new SimpleTool(TOOL_TRIANGLE, SHAPE_TRIANGLE),
  { name: 'Triangle', desc: 'drag to create a triangle', shape: SHAPE_TRIANGLE },
)
```

使用：

```ts
import { TOOL_TRIANGLE } from "./triangle/Tool"

board.setToolType(TOOL_TRIANGLE)   // 之后在板子上拖拽即可画出三角形
```

`SimpleTool` 做的事（也说明了「工具最少要做什么」）：

1. `pointerDown`：`factory.newShape(形状类型)` → 设置 `data.layer` → `board.add(shape, true)`；
2. `pointerDraw` / `pointerUp`：用 `shape.geo(x, y, w, h)` 更新几何；
3. 抬起时广播 `ShapesGeoChanged` 与 `ShapesDone`，让**撤销重做 / 录制回放**都能工作。

## 3. 路线 B：完全自定义工具

下面这个「盖章」工具：鼠标悬停显示虚线预览框，左键点击就在该处创建一个三角形。

```ts
// stamp/Tool.ts
import { EventEnum, Gaia, Rect, type Board, type IDot, type IRect, type ITool } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "../triangle/Data"

export const TOOL_STAMP = 'TOOL_STAMP'

export class StampTool implements ITool {
  get type() { return TOOL_STAMP }   // 必须与注册类型一致，否则工厂会告警

  private _board: Board | undefined
  private _size = 80
  private _hover = new Rect(0, 0, 0, 0) // 预览框（世界坐标）

  get board() { return this._board }
  set board(v) { this._board = v }

  /** 切走时清掉预览，并把残留的像素标脏 */
  end(): void {
    const board = this._board
    if (!board) return
    if (this._hover.w) board.markDirty(this._dirtyRect())
    this._hover.x = this._hover.y = this._hover.w = this._hover.h = 0
  }

  /** 未按下：预览跟着鼠标走 */
  pointerMove(dot: IDot): void {
    this.moveHoverTo(dot)
  }

  /** 左键按下：盖章 */
  pointerDown(dot: IDot): void {
    const board = this._board
    if (!board) return
    this.moveHoverTo(dot)

    const shape = board.factory.newShape(SHAPE_TRIANGLE)
    shape.data.layer = board.layer().id      // 必须指向存在的图层，否则图形不会被绘制
    board.add(shape, true)                   // 广播 ShapesAdded（operator = board.whoami）
    shape.geo(this._hover.x, this._hover.y, this._size, this._size)

    // 广播 ShapesDone：ActionQueue 会把它记为一次可撤销的操作
    board.emit(EventEnum.ShapesDone, { operator: board.whoami, shapeDatas: [shape.data.copy()] })
  }

  pointerUp(): void { /* 点击即完成，无需处理 */ }

  /** 工具自绘：ctx 已平移到世界坐标系，直接按世界坐标画 */
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
    if (hadHover) board.markDirty(prev)   // 擦掉上一帧预览
    board.markDirty(this._dirtyRect())    // 画上新一帧预览
  }

  /**
   * 预览的脏矩形：1px 描边会向矩形外溢出半个线宽（外沿多占 1px 像素），
   * 标脏时必须把它算进去，否则预览移动后会留下「残影」
   */
  private _dirtyRect(): IRect {
    const { x, y, w, h } = this._hover
    const pad = Math.ceil(1 / 2)          // 1px 描边 → 外扩 1px
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

> 想画工具自身的图形（如橡皮擦的光标），可以像 `EraserTool` 那样用一个 `Shape` 子类当「指示器」，在 `render()` 里绘制它，并在移动时自己 `markDirty()` —— 见 [writeboard/tools/eraser](../writeboard/tools/eraser)。

## 4. 事件、撤销重做与录制

### 4.1 内置事件

| 事件 | 何时广播 | ActionQueue 是否提供撤销 |
|---|---|---|
| `ShapesAdded` / `ShapesRemoved` | 增删图形 | 仅 `ShapesRemoved` |
| `ShapesChanging` / `ShapesChanged` | 属性（样式等）批量修改 | — |
| `ShapesDone` | 一次操作完成 | ✅（撤销=删除，重做=重建） |
| `ShapesGeoChanging` / `ShapesGeoChanged` | 几何变化中 / 几何变化完成 | ✅（仅当 `tool === ToolEnum.Selector`） |
| `ShapesSelected` / `ShapesDeselected` | 选择变化 | — |
| `ToolChanged` `LayerAdded` `LayerRemoved` `ViewportChanged` `WorldRectChanged` | 板子状态变化 | — |
| `ToolDown` `ToolMove` `ToolDraw` `ToolUp` | 指针事件（调试、外部同步可用） | — |

广播方式：`board.emit(EventEnum.ShapesDone, { operator: board.whoami, shapeDatas: [...] })`。
`board.add(shape, true)` / `board.remove(shape, true)` / `board.scroll_by(x, y, true)` 这类第二参传 `true` 的写法等价于「以 `board.whoami` 作为 operator 广播」。

### 4.2 撤销 / 重做

```ts
import { ActionQueue } from "@fimagine/writeboard"

const queue = new ActionQueue().setActor(board) // 按 Gaia.listActions() 里登记的事件开始记录

queue.undo()
queue.redo()
queue.canUndo   // 还能撤销吗
queue.canRedo   // 还能重做吗
```

两条规则决定了「你的工具改动能否被撤销」：

1. **`operator` 必须等于 `board.whoami`**：`ActionQueue` 会忽略其它 operator 的事件（便于多人协作时只记录自己的操作）。
2. **必须广播已登记动作的事件**：即 `Gaia.listActions()` 里的那些；内置的 `ShapesDone`、`ShapesRemoved`、`ShapesGeoChanged` 已经登记好，直接复用最省事。

### 4.3 自定义事件（进阶）

如果工具需要自己的事件类型（例如「印章已盖」还带有业务语义），可以登记自己的撤销/重做处理器：

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

// 工具里：board.emit(MyEvent.Stamped as any, { operator: board.whoami, shapeDatas: [...] } as any)
```

> `Board.emit()` 的类型只接受 `Events.IDetailMap` 里声明过的键；自定义事件不方便扩展声明时，按上面注释的方式断言即可。**更推荐直接复用内置事件**——撤销、重做、录制回放全都免费获得。

### 4.4 录制回放

`Recorder` 在 `start()` 时订阅的是 **`EventEnum` 的全部内置事件**，所以：

- 复用内置事件的工具（含 `SimpleTool`）天然支持录制/回放（`Recorder` → `getJson()` → `Player`）；
- 只广播自定义事件的操作**不会被自动录进剧本**（演示见 [demo/RecorderView.ts](../demo/RecorderView.ts)）。

## 5. 注册与信息

```ts
Gaia.registerTool(type, creator, info?)  // info: { name?, desc?, shape? }，shape 表示该工具产出/操作的图形类型
Gaia.overrideTool(type, creator?, info?)
Gaia.listTools()
Gaia.toolInfo(type)                      // { name, desc, shape }
Gaia.editToolInfo(type, info => ({ ...info, name: '新的名字' }))
```

- 工具的 `type` 与注册类型不一致时会打印 `is not corrent! check member 'type' of your Tool!`。

## 6. 常见坑

1. **忘记注册**：`board.setToolType('TOOL_XXX')` 会静默切到 `InvalidTool`（只有控制台警告）。
2. **`type` 写错**：工具用自己的 `type` 字段上报事件（例如 `ShapesGeoChanged.tool`），与注册类型不一致会让撤销等逻辑判断失准。
3. **切走时没清理**：`start()` 里挂的 window 监听要在 `end()` 摘掉；预览像素要 `markDirty()` 擦掉，否则会留在画布上。
4. **坐标搞混**：工具收到的是世界坐标；`aabb()`、`data.x/y` 也是世界坐标；只有 `path(ctx)`、`render(ctx)` 内是「图形自身坐标系」。
5. **忘了标脏**：预览变化、直接改数据后都要 `board.markDirty(rect)`；板子不会自动全屏重绘。
6. **标脏矩形要算上描边外扩**：`strokeRect(x + 0.5, y + 0.5, w, h)` 配 1px 线宽时，像素会溢到 `x + w`、`y + h` 这两行/列；只标 `w × h` 会留**残影**（脏矩形取并集变大后就会把没擦干净的边缘合成上来）。外扩 1px（或 `ceil(lineWidth / 2)`）即可——本库 `Shape.aabb()` 为 `lineWidth` 留余量是同一个道理。
7. **形状没设 `data.layer`**：创建出来的图形不会显示（与自定义图形同一坑）。
8. **页面不可见时不重绘**：渲染由 `requestAnimationFrame` 驱动，后台标签页会被浏览器暂停绘制。
