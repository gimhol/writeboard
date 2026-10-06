# writeboard

简体中文 | [English](./README.en.md)

## 介绍

可扩展的书写用白板，不依赖任何第三方库。

DEMO：[https://writeboard.gim.ink/](https://writeboard.gim.ink)

## 安装

``` shell
npm install --save @fimagine/writeboard
```

## 使用说明

### 引入样式与准备容器

板子的画布层是绝对定位的，所以：① 需要引入包内样式；② 容器要保持 `position: relative`。

``` javascript
import "@fimagine/writeboard/dist/es6/cjs/writeboard.css"
```

``` css
#container {
  position: relative; /* 必须：画布层相对容器定位 */
  width: 500px;
  height: 500px;
}
```

### 最简示例

完整示例：[examples/simplest/index.html](https://github.com/gimhol/writeboard/blob/main/examples/simplest/index.html)

下面就是该示例中的代码（示例还额外用 `ToolEnum` 生成了一排工具切换按钮）：

``` javascript
import { Gaia, FactoryEnum, ToolEnum } from "../lib/writeboard.js"

// 步骤1：创建一个默认工厂
// step 1: create a factory.
const factory = Gaia.factory(FactoryEnum.Default)();

// 步骤2：通过工厂创建一个“板子”
// step 2: create board in container element.
const board = factory.newBoard({
  element: document.getElementById('container'),
  width: 500,
  height: 500,
});

// 切换到内置工具“笔”，然后你就可以在“板子”上画东西了
// switch to built-in tool "pen", then you can draw something on board.
board.setToolType(ToolEnum.Pen);
```

使用注意：

- 示例中的 `import` 是相对路径，指向仓库内的构建产物；通过 npm 安装后请改成从包导入：`import { Gaia, FactoryEnum, ToolEnum } from "@fimagine/writeboard"`，并按上一节引入样式、让容器保持 `position: relative`。
- TypeScript 中 `document.getElementById('container')` 返回 `HTMLElement | null`，可写成 `document.getElementById('container')!`。

### React 示例

完整示例：[examples/react/](./examples/react)（入口 `index.html`，逻辑按模块分文件）

用 React 组织界面：整个界面（含顶栏）按 16:9 等比铺在窗口里（多余部分留黑边），深色黑板可上下滚动（滚轮 / 拖动滚动条 / 中键拖拽）；工具栏浮在黑板侧边、只有一列图标、可以整体收起（鼠标移到工具栏上才冒出收起按钮，还会跟着鼠标上下走），描边 / 填充 / 粗细放在浮层里，只在 hover 或点击工具按钮时出现，描边与填充都能选「透明」；摄像头停在右侧时工具栏自动让到左侧。黑板上浮着多个「摄像头窗口」（默认停靠成顶部居中一排小画面，双击小画面就放大到自由区、再双击另一个就均分自由区，也能拖到停靠带停靠或自由悬浮 / 拉伸 / 最小化 / 关闭），顶栏的「窗口」菜单统一管理这些窗口。

代码按职责分模块（和正常项目一样用 `import` / `export`）：

| 文件 | 内容 |
| --- | --- |
| `index.html` | 页面壳 + 免构建的模块加载器（CDN 引入 React / Babel standalone） |
| `main.jsx` | 入口：渲染 `<App />` |
| `App.jsx` | 应用状态与组合：舞台、黑板、顶栏、工具栏、摄像头窗口层 |
| `constants.js` | 设计尺寸、工具 / 颜色 / 粗细、摄像头常量与「透明」等配置 |
| `hooks.js` | `useWriteboard`（板子生命周期 + 事件同步）、`useElementSize` |
| `icons.jsx` / `deps.js` | 图标组件 / 依赖汇总（React 全局 + writeboard 的 ESM 导出） |
| `ui/Toolbar.jsx` | 悬浮工具栏 + 描边 / 填充 / 粗细浮层 |
| `ui/WindowMenu.jsx` | 顶栏「窗口」菜单（添加 / 关闭窗口、停靠边、对齐、形态） |
| `ui/PageOverlay.jsx`、`ui/BoardScrollbar.jsx` | 分页线 / 页码 / 空板提示、贴边滚动条 |
| `camera/CameraLayer.jsx` | 摄像头窗口层：拖动停靠、点击抬升、双击放大与均分自由区 |
| `camera/CameraWindow.jsx` | 单个摄像头窗口（视频 / 占位 + 头栏 + 8 向把手） |
| `camera/dock.js` | 停靠边 / 对齐枚举、尺寸换算、停靠带与命中判定 |
| `camera/distribution.js` | 自由区与均分算法（对应 demo 的 `get_distributions.ts`） |
| `styles.css` | 全部样式 |

示例免构建：`index.html` 里有一小段加载器，用 fetch 取模块、交给 Babel standalone 把 JSX 与 `import` 转成 CommonJS 再按依赖执行 —— 所以源码可以正常分模块，又不用打包器（生产项目请直接用 Vite / Rollup / esbuild）。

运行方式：在仓库根目录起一个静态服务器（如 `npx serve` 或 `python -m http.server`），打开 `examples/react/index.html`（要用 http 打开，`file://` 下 fetch 模块会被浏览器拦掉）。

与 React 集成的几个要点：

- **生命周期**：板子放在 effect 里创建，卸载时 `board.destroy()`，避免热更新 / 卸载后残留画布。

  ```jsx
  useEffect(() => {
    const el = containerRef.current
    const factory = Gaia.factory(FactoryEnum.Default)()
    const board = factory.newBoard({
      element: el,
      width: el.clientWidth,               // 可视区 = 容器大小
      height: el.clientHeight,
      scrollWidth: el.clientWidth,
      scrollHeight: el.clientHeight * 3,   // 世界 = 3 倍高度 → 板子可滚动
    })
    setBoard(board)
    return () => board.destroy()
  }, [containerRef])
  ```

- **滚动**：世界比可视区大即可滚动（滚轮由板子内部处理，示例里拦下来按画布缩放换算后调 `scroll_by`）；`board.scroll_to()` / `board.scroll_by()` 可编程移动可视区；滚动状态通过 `EventEnum.WorldRectChanged` / `EventEnum.ViewportChanged` 同步到 React 状态（示例中的滚动条、页码、分页线都是这么画的，滚动条贴着黑板右边缘摆）。
- **画布缩放（笔迹跟窗口走）**：画布固定按设计尺寸（`DESIGN_W × DESIGN_H`）绘制，外层元素再用 `transform: scale(kx, ky)` 铺满黑板矩形 —— 和 gim.ink 的 `views_solution_demo` 一样。这样笔迹、文字、已画内容都活在设计坐标里，窗口怎么缩放，它们相对黑板矩形的大小与位置都不变；`board.map2world()` 内部会用 `canvas.width / rect.width` 把指针坐标换算回设计坐标，所以缩放后落点依旧准确。
- **样式**：描边颜色 / 粗细 / 填充色都写在图形模板上（`board.factory.shapeTemplate(type)`），之后新建的图形即使用新样式；矩形 / 椭圆这类 `needFill` 为真的图形额外支持填充，描边与填充都能选「透明」（直接传画布认识的 `'transparent'` 即可，不描边 / 不填充）。面板上的粗细 / 字号是「参考尺寸」下的值，落到 1.5 倍的设计画布上要乘 `DESIGN_K`（橡皮擦范围同理）。
- **16:9 舞台**：`.app` 用 `width: min(100vw, 100vh * 16 / 9); height: min(100vh, 100vw * 9 / 16)` 保持 16:9（含顶栏），黑板紧贴顶栏、不留内边距，书写区域尽可能大；窗口 / 工具栏的尺寸都按黑板比例算，所以舞台怎么缩放，它们相对黑板的大小都不变。
- **窗口管理**：摄像头窗口可以有好几个（「窗口」菜单里添加 / 关闭，最多 8 个），三种形态与 blogim Chatroom 的 `ViewsSolution` 一致：
  - **停靠**：小画面沿「当前停靠边」的停靠带排成一行（尺寸 = 标准尺寸 × `CAM_DOCK_SCALE`，贴边不留间距、无投影，只有 1px 描边），整排按对齐方式居中 / 靠前 / 靠后 —— 对应 demo 的 `get_horizontal/vertical_distribution`；停靠边与对齐都由顶栏「窗口」菜单设定（对应 `DockType` / `DockAlign`），拖动时**只亮出当前停靠边这一条停靠带**（不是拖到哪条边算哪条边），窗口中心落进停靠带才停靠（和 demo 的 `should_dock` 一致）。
  - **最大化**：双击小画面或窗口头栏就把窗口铺进**自由区**（= 整块黑板减去停靠带；没有窗口停靠时就是整块黑板），多个最大化窗口在自由区里均分 —— 对应 demo 的 `get_fill_distribution`：1 个铺满、2 个左右均分、3 个三列、4 个 2×2、5 个上行 2 个 + 下行 3 个、8 个 4 列 2 行。**有多个悬浮窗口时一起放大**（它们一起均分自由区），停靠的小画面与最小化的窗口不受影响；落进自由区松手时如果已经有人最大化，这个窗口也会一起加入拼接。
  - **悬浮**：自持尺寸与位置（按黑板比例记，黑板怎么缩放它就跟到哪儿），窗口有 **8 个方向的拉伸把手**（左右上下 + 四角，对应 demo 的 `resizer_l/r/t/b/lt/rt/lb/rb`）；停靠 / 最大化 / 最小化的尺寸都由布局决定，所以把手只出现在悬浮窗口上。
  - **最小化**：收成左下角的小胶囊，点一下回到原来的形态。
  - 窗口内部的控件尺寸 = 舞台单位 × 该窗口自己的缩放（`--wu: calc(var(--u) * var(--ws))`），所以停靠的小画面里，头栏 / 按钮 / 文字会一起缩小；小画面的头栏平时是隐藏的，鼠标移上去才浮出来。
- **工具栏**：浮在黑板一侧，只有一列图标（工具 / 撤销重做 / 清空，翻页靠滚轮与滚动条），尺寸同样按 `--u` 等比缩放；整体可以收起成一个小圆钮。收起按钮平时不显示 —— 鼠标移到工具栏上才冒出来，而且它的 Y 会**跟着鼠标走**（夹在工具栏的高度范围内，鼠标停在按钮上时就不再移动），方便顺手点掉；它和工具栏之间不留缝，并有 420ms 的延时消失，鼠标从工具栏挪到按钮上不会半路消失；浮层的展开位置也会给它让出空间。
- **工具栏换边**：停靠边设为「右侧」时，工具栏与它的收起按钮一起让到黑板左侧（`.toolbar.side-left`，同时把样式浮层与箭头方向镜像过去），免得和摄像头小画面抢地方。
- **深色黑板与文本编辑框**：示例给容器写了当前颜色的 `color` / `caret-color`，再用 `color: transparent` 把文本编辑框（textarea）上的字隐掉 —— 文字由画布渲染，编辑框只负责输入与光标，颜色始终一致。
- **撤销重做**：`new ActionQueue().setActor(board)` 后调用 `undo()` / `redo()`，用 `canUndo` / `canRedo` 控制按钮可用状态。

### 不用打包器

同样三步、但不需要打包器、也不需要本仓库的版本：把下面的内容保存为 `index.html`，直接用浏览器打开即可（脚本与样式从 CDN 加载）。

``` html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.css">
  <style>
    #container {
      position: relative; /* 必须：画布层相对容器定位 */
      width: 500px;
      height: 500px;
    }
  </style>
</head>

<body>
  <div id="container"></div>

  <script src="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.js"></script>
  <script>
    const { Gaia, FactoryEnum, ToolEnum } = writeboard; // UMD 全局变量

    const factory = Gaia.factory(FactoryEnum.Default)();
    const board = factory.newBoard({
      element: document.getElementById('container'),
      width: 500,
      height: 500,
    });
    board.setToolType(ToolEnum.Pen);
  </script>
</body>

</html>
```

## 文档

默认简体中文，英文版为同名的 `.en.md`。

| 文档 | English |
|---|---|
| [docs/](./docs/README.md) 文档目录：核心概念与注册 API 速查 | [docs/README.en.md](./docs/README.en.md) |
| [docs/custom-shape.md](./docs/custom-shape.md) 自定义图形：`ShapeData` + `Shape`，含三角形/星形完整示例与常见坑 | [docs/custom-shape.en.md](./docs/custom-shape.en.md) |
| [docs/custom-tool.md](./docs/custom-tool.md) 自定义工具：`ITool` / `SimpleTool`，指针坐标、撤销重做与录制回放 | [docs/custom-tool.en.md](./docs/custom-tool.en.md) |
| [docs/recording.md](./docs/recording.md) 录制与回放：`Recorder` / `Player`，倍速、进度条、暂停、跳转与旧剧本迁移 | [docs/recording.en.md](./docs/recording.en.md) |

## 开发

``` shell
npm install        # 安装依赖
npm run build      # 构建 dist/ 下的库产物
npm test           # 构建后运行单测
npm start          # 以 watch 模式构建 demo 到 output/
npm run doc        # 生成 typedoc
```

## 参与贡献

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
