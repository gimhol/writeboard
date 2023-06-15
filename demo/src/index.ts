import {
  FactoryEnum, FactoryMgr,
  ILayerInits,
  Player, Recorder,
  Shape,
  ShapeData,
  ShapeEnum, ShapePen,
  ToolEnum,
  WhiteBoard
} from "../../dist";
import ColorView from "./ColorView";
import { Button } from "./G/BaseView/Button";
import { Canvas } from "./G/BaseView/Canvas";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { MergedSubwin } from "./G/CompoundView/MergedSubwin";
import { Subwin } from "./G/CompoundView/Subwin";
import { DockableDirection } from "./G/CompoundView/Workspace/DockableDirection";
import { WorkspaceView } from "./G/CompoundView/Workspace/WorkspaceView";
import { LayersView } from "./LayersView";
import { ToolsView } from "./ToolsView";
import { RGBA } from "./colorPalette/Color";
import demo_helloworld from "./demo_helloworld";
import demo_rect_n_oval from "./demo_rect_n_oval";

const factory = FactoryMgr.createFactory(FactoryEnum.Default)
let board: WhiteBoard

const workspace = window.workspace = new WorkspaceView('body', {
  rect() {
    return {
      x: 0, y: 0,
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
  },
  zIndex: 1000,
});

const menu = new Menu(workspace, {
  items: [{
    key: 'tool_view',
    label: '工具',
    items: [{
      key: <string>ToolEnum.Selector,
      label: <string>ToolEnum.Selector,
    }, {
      key: <string>ToolEnum.Pen,
      label: <string>ToolEnum.Pen,
    }, {
      key: <string>ToolEnum.Rect,
      label: <string>ToolEnum.Rect,
    }, {
      key: <string>ToolEnum.Oval,
      label: <string>ToolEnum.Oval,
    }, {
      key: <string>ToolEnum.Text,
      label: <string>ToolEnum.Text,
    }]
  }, {
    key: 'menu_item_1',
    label: 'menu_item_1'
  }, {
    key: 'menu_item_2',
    divider: true
  }, {
    key: 'menu_item_3',
    label: 'menu_item_3',
    items: [{
      key: 'menu_item_3_0',
      label: 'menu_item_3_0'
    }, {
      key: 'menu_item_3_1',
      label: 'menu_item_3_1'
    }, {
      key: 'menu_item_3_2',
      divider: true
    }, {
      key: 'menu_item_3_3',
      label: 'menu_item_3_3',
    }]
  }]
});
menu.addEventListener(Menu.EventType.ItemClick, (e) => {
  console.log(e.detail.key)
  switch (e.detail.key) {
    case ToolEnum.Rect:
    case ToolEnum.Oval:
    case ToolEnum.Pen:
    case ToolEnum.Polygon:
    case ToolEnum.Text:
    case ToolEnum.Selector:
      board.setToolType(e.detail.key);
      break;
  }
});

const layersView = new LayersView();
workspace.addChild(layersView);
layersView.addEventListener(LayersView.EventType.LayerAdded, () => {
  const layerItem = layersView.addLayer({
    name: '' + Date.now(),
    id: factory.newLayerId()
  });
  const canvas = addLayerCanvas();
  board.addLayer({ info: layerItem.state, onscreen: canvas.inner });
})
layersView.addEventListener(LayersView.EventType.LayerVisibleChanged, e => {
  const { id, visible } = e.detail;
  const layer = board.layer(id);
  if (!layer) { return; }
  layer.opacity = visible ? 1 : 0;
})
layersView.addEventListener(LayersView.EventType.LayerActived, e => {
  const { id } = e.detail;
  board.editLayer(id);
})
layersView.addLayer({
  name: '' + Date.now(),
  id: factory.newLayerId()
});

const toolsView = new ToolsView;
workspace.addChild(toolsView)
toolsView.styles.apply('normal', (v) => ({ ...v, left: '150px', top: 5 }))
toolsView.onToolClick = (btn) => board.setToolType(btn.toolType!)

const colorView = new ColorView;
workspace.addChild(colorView)
colorView.styles.apply('normal', (v) => ({ ...v, left: '150px', top: '400px' }))
colorView.inner.addEventListener(ColorView.EventTypes.LineColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  FactoryMgr.listTools().forEach(toolType => {
    const shape = FactoryMgr.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.strokeStyle = '' + rgba.toHex();
  })
})
colorView.inner.addEventListener(ColorView.EventTypes.FillColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  FactoryMgr.listTools().forEach(toolType => {
    const shape = FactoryMgr.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.fillStyle = '' + rgba.toHex();
  })
})

class ToyView extends Subwin { }
const toyView = new ToyView();
toyView.header.title = 'others';
workspace.addChild(toyView);

window.addEventListener('resize', () => workspace.clampAllSubwin())

toyView.content = new View('div');
toyView.content.styles.apply('', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden'
})
toyView.content.addChild()

new Button().init({
  content: 'select all'
}).addEventListener('click', () => board.selectAll())

toyView.content.addChild(new Button().init({
  content: 'remove selected'
}).addEventListener('click', () => board.removeSelected()))

toyView.content.addChild(new Button().init({
  content: 'remove all'
}).addEventListener('click', () => board.removeAll()))

function randomShapeItem(item: Shape<ShapeData>) {
  const v255 = () => Math.floor(Math.random() * 255)
  item.geo(
    Math.floor(Math.random() * board.width),
    Math.floor(Math.random() * board.height!), 50, 50)
  item.data.fillStyle = `rgb(${v255()},${v255()},${v255()})`
  item.data.strokeStyle = `rgb(${v255()},${v255()},${v255()})`
}

toyView.content.addChild(new Button().init({
  content: 'random add 1000 rect'
}).addEventListener('click', () => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Rect)
    item.data.layer = board.layer().id;
    randomShapeItem(item);
    items.push(item)
  }
  board.add(...items)
}))

toyView.content.addChild(new Button().init({
  content: 'random add 1000 oval'
}).addEventListener('click', () => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Oval)
    item.data.layer = board.layer().id;
    randomShapeItem(item);
    items.push(item)
  }
  board.add(...items)
}))

toyView.content.addChild(new Button().init({
  content: 'random draw 1000 pen'
}).addEventListener('click', () => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    item.data.layer = board.layer().id;
    let x = Math.floor(Math.random() * board.width!);
    let y = Math.floor(Math.random() * board.height!);
    const v5 = () => Math.floor(Math.random() * 5)
    const lenth = Math.floor(Math.random() * 100)
    for (let j = 0; j < lenth; ++j) {
      x += v5();
      y += v5();
      item.appendDot({ x, y, p: 0.5 })
    }
    randomShapeItem(item);
    items.push(item)
  }
  board.add(...items)
}))

let _recorder: Recorder | undefined
let _player: Player | undefined


class JsonView extends Subwin { }
const jsonView = new JsonView();
workspace.addChild(jsonView)
jsonView.header.title = 'json';
jsonView.content = new View('div');
jsonView.content.styles.apply('', { flex: 1, display: 'flex', flexDirection: 'column' })
const json_textarea = new View('textarea')
jsonView.content.addChild(new Button().init({ content: 'JSON化' }).addEventListener('click', () => {
  json_textarea.inner.value = board.toJsonStr();
}));
jsonView.content.addChild(new Button().init({ content: '反JSON化' }).addEventListener('click', () => {
  board.fromJsonStr(json_textarea.inner.value)
}));
jsonView.content.addChild(json_textarea);


const startRecord = () => {
  _recorder?.destory();
  _recorder = new Recorder();
  _recorder.start(board);
}
const endRecord = () => {
  if (!_recorder_textarea || !_recorder)
    return
  _recorder_textarea.inner.value = _recorder.toJsonStr()
  _recorder?.destory()
  _recorder = undefined
}
const replay = (str: string) => {
  _player?.stop()
  _player = new Player()
  _player.start(board, JSON.parse(str))
}

class RecorderView extends Subwin { }
const recorderView = new RecorderView();
workspace.addChild(recorderView)
recorderView.header.title = 'recorder';
recorderView.content = new View('div');
recorderView.content.styles.apply('', { flex: 1, display: 'flex', flexDirection: 'column' })
const _recorder_textarea = new View('textarea')
recorderView.content.addChild(new Button().init({ content: '开始录制' }).addEventListener('click', startRecord));
recorderView.content.addChild(new Button().init({ content: '停止录制' }).addEventListener('click', endRecord));
recorderView.content.addChild(new Button().init({ content: '回放' }).addEventListener('click', () => {
  endRecord()
  replay(_recorder_textarea.inner.value)
}));

recorderView.content.addChild(new Button().init({ content: 'replay: write "hello world"' }).addEventListener('click', () => {
  endRecord()
  replay(demo_helloworld)
}));
recorderView.content.addChild(new Button().init({ content: 'replay: rect & oval' }).addEventListener('click', () => {
  endRecord()
  replay(demo_rect_n_oval)
}));
recorderView.content.addChild(_recorder_textarea);


const rootView = new View('div');
rootView.styles.apply('', { pointerEvents: 'all' }).addCls('root');
workspace.rootDockView.setContent(rootView);

const blackboard = new View('div');
blackboard.styles.addCls('blackboard');
rootView.addChild(blackboard);

function addLayerCanvas() {
  const canvas = new Canvas();
  canvas.styles.apply('', {
    position: 'absolute',
    touchAction: 'none',
    userSelect: 'none',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transition: 'opacity 200ms'
  })
  canvas.inner.addEventListener('contextmenu', (e) => {
    menu.move(e.x, e.y).show();
  })
  canvas.draggable = false;
  blackboard.addChild(canvas);
  return canvas;
}

const layers = layersView.layers().map<ILayerInits>((layer, idx) => {
  const canvas = addLayerCanvas();
  return { info: layer.state, onscreen: canvas.inner }
})
board = factory.newWhiteBoard({ layers, width: 1024, height: 1024 });
(window as any).board = board;


workspace.dockToRoot(layersView, DockableDirection.H, 'end');
workspace.dockToRoot(toolsView, DockableDirection.H, 'start');