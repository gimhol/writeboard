# writeboard Documentation

[简体中文](./README.md) | English

Back to [project README](../README.en.md)

## Guides

| Doc | Content |
|---|---|
| [Custom Shape](./custom-shape.en.md) ([简体中文](./custom-shape.md)) | Define a new shape with `ShapeData` + `Shape` and register it in `Gaia`, so that `factory.newShape()`, snapshots and undo/redo can all handle it |
| [Custom Tool](./custom-tool.en.md) ([简体中文](./custom-tool.md)) | Define a new tool with `ITool` (or reuse `SimpleTool`), handle pointer events, and hook into undo/redo and recording/playback |

## Core concepts

| Concept | Class / interface | Description |
|---|---|---|
| Registry | `Gaia` | Global registry: factories, tools, shapes, fonts and actions (undo/redo) are all registered here |
| Factory | `IFactory` / `DefaultFactory` | Object factory: `newBoard()`, `newShape()`, `newTool()`, `newShapeData()`, `newLayer()` … |
| Board | `Board` | One board: layers, shape collection, hit-testing, dirty-rect repaint and an event bus |
| Layer | `Layer` | One canvas layer (an onscreen canvas plus an offscreen canvas) |
| Shape | `Shape` subclass | How a single shape is drawn: path, geometry, decoration |
| Shape data | `ShapeData` subclass | What a single shape is: type, geometry, style, status; JSON-serializable |
| Tool | `ITool` implementation | Translates pointer events into shape operations (create, select, edit, erase …) |
| Decoration | `IShapeDecoration` | Draws the selection box, handles, locked and ghost visuals centrally |
| Undo/redo | `ActionQueue` + `Gaia.registAction()` | Registers undo/redo handlers per event type; driven by `ActionQueue` |
| Recording/playback | `Recorder` / `Player` | Records and replays the **built-in events** happening on a board |

## Registry API cheat-sheet

| API | Purpose |
|---|---|
| `Gaia.registerShape(type, dataCreator, shapeCreator, info?)` | Register a shape: type → data creator → shape creator |
| `Gaia.overrideShape(type, dataCreator?, shapeCreator?, info?)` | Override an existing shape (also useful to replace built-ins) |
| `Gaia.registerTool(type, creator, info?)` | Register a tool |
| `Gaia.overrideTool(type, creator?, info?)` | Override an existing tool |
| `Gaia.registerFactory(type, creator, info?)` | Register a factory |
| `Gaia.registAction(eventType, { isAction, undo, redo })` | Register undo/redo handlers for an event type |
| `Gaia.registerFont(infos)` / `Gaia.checkFont(family)` | Register fonts / check whether a font family is available |
| `Gaia.listShapes()` / `Gaia.listTools()` / `Gaia.listFactories()` / `Gaia.listActions()` | List registered items |
| `Gaia.shapeInfo(type)` / `Gaia.toolInfo(type)` | Read registration info (name, description, related shape) |
| `Gaia.fonts` | Table of available fonts (`Map<string, IFontInfo>`) |

> Type conventions: `ShapeType = ShapeEnum | string`, `ToolType = ToolEnum | string`.
> Built-in shapes use the numeric `ShapeEnum`; **custom shapes should use strings**. Built-in tools use the string enum `ToolEnum`; **custom tools should use strings too**.

## Where to register

Registration is a **top-level module side effect** (that is how the built-ins do it). Just make sure the registering module runs once:

```ts
import { Gaia } from "@fimagine/writeboard"
import { MyData } from "./myData"
import { MyShape } from "./myShape"

Gaia.registerShape('MY_SHAPE', () => new MyData(), d => new MyShape(d))
```

See [writeboard/shape/rect](../writeboard/shape/rect) for the built-in layout: `Data.ts` (data), `Shape.ts` (shape + registration), `Tool.ts` (tool + registration) and `index.ts`.

It is recommended to give your custom shape/tool folder an `index.ts` that re-exports everything, so a single `import "./triangle"` runs all registrations (that is what [writeboard/shape/index.ts](../writeboard/shape/index.ts) does).
