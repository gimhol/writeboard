import {
  Board, FactoryEnum, Gaia, Player, Recorder,
  Shape,
  ShapeData,
  ShapeEnum, ShapePen,
  ToolEnum
} from "../../dist";
import { EventEnum } from "../../dist/event";
import { RGBA } from "./colorPalette/Color";
import ColorView from "./ColorView";
import demo_helloworld from "./demo_helloworld";
import demo_rect_n_oval from "./demo_rect_n_oval";
import { Button } from "./G/BaseView/Button";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { DockableDirection } from "./G/CompoundView/Workspace/DockableDirection";
import { WorkspaceView } from "./G/CompoundView/Workspace/WorkspaceView";
import { SnapshotView } from "./SnapshotView";
import { LayersView } from "./LayersView";
import { RecorderView } from "./RecorderView";
import { ToolsView } from "./ToolsView";
import { ToyView } from "./ToyView";

const factory = Gaia.factory(FactoryEnum.Default)();

let board: Board

const workspace = new WorkspaceView('body', {
  rect() {
    return {
      x: 0, y: 0,
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
  },
  zIndex: 1000,
});

enum MenuKey {
  SelectAll = 'SelectAll',
  RemoveSelected = 'RemoveSelected',
  Deselect = 'Deselect',
  ClearUp = 'ClearUp',
}
const menu = new Menu(workspace, {
  items: [{
    label: '工具',
    items: Gaia.listTools().map(v => ({ key: v, label: v }))
  }, {
    divider: true
  }, {
    key: MenuKey.SelectAll,
    label: '全选'
  }, {
    key: MenuKey.Deselect,
    label: '取消选择'
  }, {
    key: MenuKey.RemoveSelected,
    label: '删除选择'
  }, {
    divider: true
  }, {
    key: MenuKey.ClearUp,
    label: '删除全部',
    danger: true,
  }]
});

menu.addEventListener(Menu.EventType.ItemClick, (e) => {
  switch (e.detail.key) {
    case ToolEnum.Rect:
    case ToolEnum.Oval:
    case ToolEnum.Pen:
    case ToolEnum.Polygon:
    case ToolEnum.Text:
    case ToolEnum.Selector:
    case ToolEnum.Tick:
    case ToolEnum.Cross:
    case ToolEnum.HalfTick:
    case ToolEnum.Lines:
      board.setToolType(e.detail.key);
      break;
    case MenuKey.SelectAll:
      board.selectAll();
      break;
    case MenuKey.Deselect:
      board.deselect();
      break;
    case MenuKey.RemoveSelected:
      board.removeSelected();
      break;
    case MenuKey.ClearUp:
      board.removeAll();
      break;
  }
});

const layersView = new LayersView();
workspace.addChild(layersView);
layersView.addEventListener(LayersView.EventType.LayerAdded, () => {
  const layer = factory.newLayer({
    info: {
      name: factory.newLayerName(),
      id: factory.newLayerId()
    },
    onscreen: document.createElement('canvas')
  })
  layersView.addLayer(layer);
  board.addLayer(layer);
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

const toolsView = new ToolsView;
workspace.addChild(toolsView)
toolsView.onToolClick = (btn) => board.setToolType(btn.toolType!)

const colorView = new ColorView;
workspace.addChild(colorView)
colorView.inner.addEventListener(ColorView.EventTypes.LineColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  Gaia.listTools().forEach(toolType => {
    const shape = Gaia.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.strokeStyle = '' + rgba.toHex();
  })
})
colorView.inner.addEventListener(ColorView.EventTypes.FillColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  Gaia.listTools().forEach(toolType => {
    const shape = Gaia.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.fillStyle = '' + rgba.toHex();
  })
})

const toyView = new ToyView();
toyView.board = () => board;
workspace.addChild(toyView);

const snapshotView = new SnapshotView();
snapshotView.board = () => board;
workspace.addChild(snapshotView)

const recorderView = new RecorderView();
recorderView.board = () => board;
workspace.addChild(recorderView)

const rootView = new View('div');
rootView.styles.apply('', { pointerEvents: 'all' }).addCls('root');
workspace.rootDockView.setContent(rootView);

const blackboard = new View('div');
blackboard.styles.addCls('blackboard');
rootView.addChild(blackboard);

board = factory.newWhiteBoard({ width: 1024, height: 1024, element: blackboard.inner });
Object.assign(window, {
  board, factory, workspace, FactoryMgr: Gaia
});
workspace.dockToRoot(toolsView, DockableDirection.H, 'start');
workspace.dockToRoot(colorView, DockableDirection.H, 'end')
workspace.dockAround(toyView, colorView, DockableDirection.V, 'end');
workspace.dockAround(recorderView, toyView, DockableDirection.V, 'end');
workspace.dockAround(snapshotView, recorderView, DockableDirection.V, 'end');
workspace.dockAround(layersView, snapshotView, DockableDirection.V, 'end');

const oncontextmenu = (e: MouseEvent) => {
  menu.move(e.x, e.y).show();
  e.stopPropagation();
  e.preventDefault();
};
const onkeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && !e.shiftKey && !e.altKey) {
    const func = ctrlShorcuts.get(e.key);
    if (func) {
      func();
      e.stopPropagation();
      e.preventDefault();
    }
  } else if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
    do {
      const toolEnum = toolShortcuts.get(e.key);
      if (toolEnum) {
        board.setToolType(toolEnum);
        toolsView.setToolType(toolEnum);
        e.stopPropagation();
        e.preventDefault();
        break;
      }
      const func = onekeyShorcuts.get(e.key);
      if (func) {
        func();
        e.stopPropagation();
        e.preventDefault();
        break;
      }
    } while (false);
  }
}
const toolShortcuts = new Map<string, ToolEnum>([
  ['s', ToolEnum.Selector],
  ['p', ToolEnum.Pen],
  ['r', ToolEnum.Rect],
  ['o', ToolEnum.Oval],
  ['t', ToolEnum.Text],
  ['z', ToolEnum.Tick],
  ['c', ToolEnum.Cross],
  ['x', ToolEnum.HalfTick],
  ['l', ToolEnum.Lines]
])
const onekeyShorcuts = new Map<string, () => void>([
  ['Delete', () => board.removeSelected()]
])
const ctrlShorcuts = new Map<string, () => void>([
  ['a', () => board.selectAll()],
  ['d', () => board.deselect()],
])
board.addEventListener(EventEnum.LayerAdded, e => {
  e.detail.onscreen.addEventListener('keydown', onkeydown)
  e.detail.onscreen.addEventListener('contextmenu', oncontextmenu)
});
board.addEventListener(EventEnum.LayerRemoved, e => {
  e.detail.onscreen.removeEventListener('keydown', onkeydown)
  e.detail.onscreen.removeEventListener('contextmenu', oncontextmenu)
});
board.layers.forEach(layer => {
  layer.onscreen.addEventListener('keydown', onkeydown)
  layer.onscreen.addEventListener('contextmenu', oncontextmenu)
  layersView.addLayer(layer)
})
window.addEventListener('resize', () => workspace.clampAllSubwin())

window.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'a') {
    e.stopPropagation();
  }
})