# 自定义图形

简体中文 | [English](./custom-shape.en.md)

返回 [文档目录](./README.md)

writeboard 的图形分成两层，各管一件事：

| 层 | 基类 | 职责 |
|---|---|---|
| 数据 | `ShapeData` | 图形**是什么**：类型、位置尺寸、旋转、样式、状态；决定序列化内容 |
| 绘制 | `Shape` | 图形**怎么画**：路径或完全自绘；包围盒、命中、选择框、可拉伸方向由基类提供 |

把两者注册到 `Gaia` 之后，`factory.newShape(type)`、快照、撤销/重做就都能认识你的图形。

## 1. 最小示例：三角形

新建 `triangle/` 目录，与内置图形保持一致：`Data.ts`、`Shape.ts`、`index.ts`。

### 1.1 类型标识

内置图形用数字枚举 `ShapeEnum`，**自定义图形用字符串**（推荐全大写、带前缀）：

```ts
export const SHAPE_TRIANGLE = 'SHAPE_TRIANGLE'
```

### 1.2 数据类

```ts
// triangle/Data.ts
import { ShapeData } from "@fimagine/writeboard"

export const SHAPE_TRIANGLE = 'SHAPE_TRIANGLE'

export class TriangleData extends ShapeData {
  constructor(other?: Partial<TriangleData>) {
    super()                       // 不要写 super(other)，原因见「常见坑」
    this.type = SHAPE_TRIANGLE    // 必须与注册时使用的类型完全一致
    this.strokeStyle = '#ff5722'  // 默认样式
    this.lineWidth = 4
    other && this.read(other)     // 序列化数据回填：子类要自己调用 read
  }
}
```

### 1.3 图形类

继承 `ShapeNeedPath` 只需要实现 `path(ctx)`，填充、描边、旋转、缩放、选中框都由基类处理：

```ts
// triangle/Shape.ts
import { Gaia, ShapeNeedPath } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE, TriangleData } from "./Data"

export class ShapeTriangle extends ShapeNeedPath<TriangleData> {
  constructor(data: Partial<TriangleData>) {
    super(data, TriangleData)
  }

  /** 在「本图形左上角为原点」的坐标系里绘制路径 */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath()
    ctx.moveTo(x + w / 2, y)      // 顶点
    ctx.lineTo(x + w, y + h)      // 右下
    ctx.lineTo(x, y + h)          // 左下
    ctx.closePath()
  }
}

// 注册：类型 → 数据创建器 → 图形创建器
Gaia.registerShape(SHAPE_TRIANGLE, () => new TriangleData(), d => new ShapeTriangle(d), {
  name: 'Triangle',
  desc: 'triangle shape',
})
```

> 注册语句写在模块顶层，只要这个模块被 `import` 过一次就生效（内置图形也是这样注册的，见 [writeboard/shape/rect](../writeboard/shape/rect)）。

## 2. 创建并显示

```ts
import { FactoryEnum, Gaia } from "@fimagine/writeboard"
import { SHAPE_TRIANGLE } from "./triangle/Data"
import "./triangle/Shape"                    // 副作用：执行 Gaia.registerShape()

const factory = Gaia.factory(FactoryEnum.Default)()
const board = factory.newBoard({ element: container, width: 500, height: 500 })

const tri = factory.newShape(SHAPE_TRIANGLE) // 自动分配 id 与 z
tri.data.layer = board.layer().id            // 必须：图形只会画在「存在的图层」上
board.add(tri, true)                         // true → 以 board.whoami 为 operator 广播 ShapesAdded
tri.geo(100, 100, 120, 100)                  // x, y, w, h；会自动标脏重绘
```

要点：

- `board.add()` 之后图形才有 `board`，`geo()` 之类带脏标记的方法才会触发重绘。
- `data.layer` 必须是已存在图层的 id，否则 `Board.render()` 会跳过它（**图形不显示的头号原因**）。
- 想让用户拖拽生成，用「[自定义工具](./custom-tool.md)」里的 `SimpleTool` 即可。

## 3. 数据类详解

### 3.1 基础字段

`ShapeData` 用短键存储（减小 JSON 体积），同时提供可读的 getter/setter：

| 短键 | getter | 说明 |
|---|---|---|
| `t` | `type` | 类型：`ShapeEnum` 或自定义字符串 |
| `i` | `id` | 唯一 id，`factory.newShape()` 会自动赋值 |
| `x` `y` `w` `h` | `x` `y` `w` `h` | 位置与尺寸（世界坐标） |
| `z` | `z` | 层级，越大越靠上 |
| `r` | `rotation` | 旋转（弧度） |
| `c` `d` | `scaleX` `scaleY` | 缩放，默认 1（等于 1 时不写入 JSON） |
| `l` | `layer` | 所属图层 id |
| `g` | `groupId` | 分组 id |
| `a` | `style` | 样式，见 3.3 |
| `b` | `status` | 状态，见 3.3 |

还有一批只读便捷属性：`left/right/top/bottom`、`midX/midY`、`halfW/halfH`，以及 `Shape` 上的 `topLeft`、`rotatedMidTop` 等 16 个角点/边中点。

### 3.2 自定义字段

内置图形（`PenData.coords`、`PolygonData.dots`、`TextData.text` …）都遵循同一套做法：**短键存储 + `override read()` 回填**：

```ts
import { ShapeData } from "@fimagine/writeboard"

export class StarData extends ShapeData {
  /** 自定义字段：角数。建议用短键，和内置风格保持一致 */
  u: number = 5
  get points() { return this.u }
  set points(v: number) { this.u = v }

  constructor(other?: Partial<StarData>) {
    super()
    this.type = 'SHAPE_STAR'
    this.fillStyle = '#ffc107'
    other && this.read(other)
  }

  /** 基类 read 只处理基础字段，自定义字段要自己读 */
  override read(other: Partial<StarData>) {
    super.read(other)
    const { u = other.points } = other
    if (typeof u === 'number') this.u = u
    return this
  }
}
```

自定义字段只要满足两点，就能跟着 `toJson()` / 快照 / 撤销一起走：**是可 JSON 化的值**（数字、字符串、数组、简单对象），并且 **`read()` 里能回填**。

> 需要更严格的类型约束时，可以像内置图形那样再声明一个 `interface IStarData extends IShapeData { u: number }` 并 `implements` 它。

### 3.3 样式与状态

样式（`data.style`）：`fillStyle`、`strokeStyle`、`lineWidth`、`lineCap`、`lineJoin`、`lineDash`、`lineDashOffset`、`miterLimit`。

`ShapeNeedPath` 的绘制规则是「有 `fillStyle` 就填充、有 `lineWidth && strokeStyle` 就描边」；子类可以用 `get needFill()` / `get needStroke()` 关掉其中一项（`PenData` 就返回 `needFill = false`）。

状态（`data.status`）：`visible`、`selected`、`editing`、`locked`、`ghost`。

- `ghost`：可见但不可交互（做背景图很合适）；`locked`：可见、可选中，但不能被拖动修改。
- 这些状态**不需要图形自己画**，`Board.shapeDecoration` 会统一绘制选中框、控制点、锁定标识。

## 4. 绘制方式

### 4.1 路径型（推荐）：`ShapeNeedPath` + `path()`

适合矩形、椭圆、多边形、星形等「一条路径」就能描述的图形——见第 1 节的三角形；内置的 `Rect`/`Oval`/`Polygon`/`Tick`/`Cross`/`HalfTick` 都是这么写的。

### 4.2 完全自绘：`Shape` + `override render()`

需要多段路径、渐变、图片、文字排版时，直接继承 `Shape`：

```ts
import { Gaia, Resizable, Shape } from "@fimagine/writeboard"
import { StarData } from "./Data"

export class ShapeStar extends Shape<StarData> {
  constructor(data: Partial<StarData>) {
    super(data, StarData)
    this.resizable = Resizable.All // 默认是 Resizable.None（不出现控制点）
  }

  override render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return
    this.beginDraw(ctx)   // save() + 平移到图形原点、应用旋转与缩放
    this.drawStar(ctx)
    this.endDraw(ctx)     // restore()
    super.render(ctx)     // 别忘了：选中框 / 控制点 / 锁定 / ghost 装饰
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

## 5. 几何、命中与可拉伸

| 需求 | API |
|---|---|
| 改位置尺寸（自动标脏） | `geo(x, y, w, h)`、`move(x, y)`、`resize(w, h)`、`geoBy(dx, dy, dw, dh)`、`setGeo(rect)` |
| 旋转 | `rotateTo(rad, x?, y?)`、`rotateBy(delta, x?, y?)` |
| 本图坐标系绘制范围 | `drawingRect()` → `{ x: 0, y: 0, w, h }` |
| 选择框范围 | `selectorRect()` |
| 轴对齐包围盒（脏矩形用它） | `aabb()` |
| 旋转包围盒（命中判定用它） | `obb()` |
| 坐标换算 | `map2me(世界坐标)` / `map2world(本图坐标)` |
| 可拉伸方向 | `this.resizable = Resizable.None / Horizontal / Vertical / Corner / All / <具体方向>` |

命中判定默认按 **obb 包围盒**（`DefaultShapesMgr.is_hit()`），也就是「落在这个图形矩形范围内」即算命中。需要像素级精确判定时，给 `board.hit()` / `board.hits()` 传第三个判定函数：

```ts
const shape = board.hit(rect, (s, r) => s.type === 'SHAPE_TRIANGLE' && /* 你自己的精确判定 */ true)
```

## 6. 脏矩形与重绘

板子不是整屏重画，而是靠脏矩形增量合成，所以**改了 `data` 必须标脏**：

```ts
const prev = this.data.copy()
this.beginDirty(prev)   // 标记「旧位置」需要重绘，并派发 StartDirty
this.data.rotation += 0.1
this.endDirty(prev)     // 标记「新位置」需要重绘，并派发 EndDirty
```

- 用 `geo()` / `merge()` 等内置方法时会自动标脏，无需手写。
- 只改自定义字段（例如 `star.points = 7`）时不会自动标脏，需要自己 `beginDirty/endDirty`（或至少 `this.markDirty()`）。
- `aabb()` 的结果必须覆盖所有绘制内容（含描边、外溢装饰），否则会出现「残影」；基类已按 `lineWidth` 与 `factory.overbound()` 留出余量。
- 如果你自己在工具/图形里调 `board.markDirty(rect)`（而不是走 `geo()`），记得把描边的外扩算进去——原因与实测见[自定义工具的常见坑](./custom-tool.md#6-常见坑)。

## 7. 序列化与恢复

```ts
shape.data.copy()      // 浅拷贝：事件参数、撤销快照建议传副本
shape.data.wash()      // 清洗掉空字段，得到可直接 JSON 的数据
board.toJson()         // 整个板子（图层 + 全部图形）
board.fromJson(json)   // 还原

board.factory.newShape(data)  // 用数据还原图形：data 里已有 i/z 时不会重新分配 id
```

- 事件里传递数据建议用 `shape.data.copy()`，避免后续修改影响历史记录（内置工具也是这么做的）。
- `wash()` 只清理基础字段，自定义字段如需一起清理，可在子类里 `override wash()`。

## 8. 常见坑

1. **`super()` 之后再 `read()`**：`ShapeData` 构造函数里写 `super(other)` 会跳过子类的 `read`，必须 `super()` + `this.read(other)`。
2. **`data.type` 必须等于注册类型**，否则 `factory.newShape()` 会打印 `is not corrent! check member 'type' of your ShapeData!`（图形类对不上时也有同样的告警）。
3. **类型常量别和图形类同名**：两个都叫 `ShapeX` 会在 `import` 时报 `TS2440: Import declaration conflicts with local declaration`。常量建议全大写。
4. **忘了注册**：未注册的类型只会拿到基类 `ShapeData` + 基类 `Shape`，并在控制台看到 `... is not registered`。
5. **注册模块没被执行**：注册语句在 `Shape.ts` 里，但只 `import` 了 `Data.ts`，注册就不会发生——给目录加 `index.ts` 统一导出最省事。
6. **`data.layer` 不是有效图层 id**：图形不会被渲染，也不报错（最难查）。
7. **改了数据没标脏**：画面不更新，见第 6 节。
8. **页面不可见时不会重绘**：渲染由 `requestAnimationFrame` 驱动，浏览器标签页处于后台/隐藏状态时不会绘制（这是浏览器行为）。
