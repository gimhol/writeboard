# writeboard 文档

简体中文 | [English](./README.en.md)

返回 [项目 README](../README.md)

## 指南

| 文档 | 内容 |
|---|---|
| [自定义图形](./custom-shape.md)（[English](./custom-shape.en.md)） | 用 `ShapeData` + `Shape` 定义新图形并注册到 `Gaia`，让 `factory.newShape()`、快照、撤销都能认识它 |
| [自定义工具](./custom-tool.md)（[English](./custom-tool.en.md)） | 用 `ITool`（或复用 `SimpleTool`）定义新工具，处理指针事件，接入撤销重做与录制回放 |

## 核心概念

| 概念 | 类 / 接口 | 说明 |
|---|---|---|
| 注册表 | `Gaia` | 全局注册表：工厂、工具、图形、字体、动作（撤销/重做）都在这里登记 |
| 工厂 | `IFactory` / `DefaultFactory` | 造物工厂：`newBoard()`、`newShape()`、`newTool()`、`newShapeData()`、`newLayer()` … |
| 板子 | `Board` | 一块板子：图层管理、图形集合、命中检测、脏矩形重绘、事件总线 |
| 图层 | `Layer` | 一层画布（每层一张 onscreen canvas + 一张 offscreen canvas） |
| 图形 | `Shape` 子类 | 单个图形「怎么画」：路径、几何、装饰 |
| 图形数据 | `ShapeData` 子类 | 单个图形「是什么」：类型、位置、样式、状态，可 JSON 序列化 |
| 工具 | `ITool` 实现 | 把指针事件翻译成对图形的操作（创建、选择、编辑、擦除…） |
| 装饰 | `IShapeDecoration` | 统一绘制「选中框 / 控制点 / 锁定 / ghost」等，图形自身不必关心 |
| 撤销重做 | `ActionQueue` + `Gaia.registAction()` | 按事件登记 undo/redo 处理器，由 `ActionQueue` 驱动 |
| 录制回放 | `Recorder` / `Player` | 记录并重放板子上发生的**内置事件** |

## 注册 API 速查

| API | 用途 |
|---|---|
| `Gaia.registerShape(type, dataCreator, shapeCreator, info?)` | 注册图形：类型 → 数据创建器 → 图形创建器 |
| `Gaia.overrideShape(type, dataCreator?, shapeCreator?, info?)` | 覆盖已注册的图形（可用于替换内置图形） |
| `Gaia.registerTool(type, creator, info?)` | 注册工具 |
| `Gaia.overrideTool(type, creator?, info?)` | 覆盖已注册的工具 |
| `Gaia.registerFactory(type, creator, info?)` | 注册工厂 |
| `Gaia.registAction(eventType, { isAction, undo, redo })` | 为某个事件登记撤销/重做处理器 |
| `Gaia.registerFont(infos)` / `Gaia.checkFont(family)` | 登记字体 / 检测字体在当前环境是否可用 |
| `Gaia.listShapes()` / `Gaia.listTools()` / `Gaia.listFactories()` / `Gaia.listActions()` | 列出已注册项 |
| `Gaia.shapeInfo(type)` / `Gaia.toolInfo(type)` | 读取注册信息（名称、描述、对应图形） |
| `Gaia.fonts` | 可用字体表 `Map<string, IFontInfo>` |

> 类型约定：`ShapeType = ShapeEnum | string`，`ToolType = ToolEnum | string`。
> 内置图形用数字枚举 `ShapeEnum`，**自定义图形请用字符串**；内置工具用字符串枚举 `ToolEnum`，**自定义工具同样用字符串**。

## 在哪里注册

注册是**模块顶层副作用**（内置图形/工具就是这么做的），只要保证注册代码被执行一次即可：

```ts
import { Gaia } from "@fimagine/writeboard"
import { MyData } from "./myData"
import { MyShape } from "./myShape"

Gaia.registerShape('MY_SHAPE', () => new MyData(), d => new MyShape(d))
```

内置图形的写法可参考 [writeboard/shape/rect](../writeboard/shape/rect)：`Data.ts`（数据）、`Shape.ts`（图形 + 注册）、`Tool.ts`（工具 + 注册）、`index.ts`。

推荐给自定义图形/工具也建一个 `index.ts` 统一 `export *` 出去，这样只要 `import "./triangle"` 就会连带执行所有注册语句（本仓库的 [writeboard/shape/index.ts](../writeboard/shape/index.ts) 就是这么做的）。
