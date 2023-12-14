import {
  Board, FactoryEnum, Gaia,
  ObjectFit,
  ShapeEnum,
  ShapeImg,
  ToolEnum
} from "../../dist/cjs";
import ColorView from "./ColorView";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { DockableDirection } from "./G/CompoundView/Workspace/DockableDirection";
import { WorkspaceView } from "./G/CompoundView/Workspace/WorkspaceView";
import { LayersView } from "./LayersView";
import { RecorderView } from "./RecorderView";
import { SnapshotView } from "./SnapshotView";
import { ToolsView } from "./ToolsView";
import { ToyView } from "./ToyView";
import { RGBA } from "./colorPalette/Color";

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
  InsertImage = 'InsertImage',
  ExportResult = 'ExportResult',
}
const menu = new Menu(workspace);


menu.setup([{
  label: '工具',
  items: Gaia.listTools().map(v => ({ key: v, label: v }))
}, {
  divider: true
}, {
  key: MenuKey.InsertImage,
  label: '插入图片'
}, {
  divider: true
}, {
  key: MenuKey.ExportResult,
  label: '生成图片'
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
}])

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
    case ToolEnum.Img:
      board.setToolType(e.detail.key);
      break;
    case MenuKey.SelectAll:
      board.selectAll(true);
      break;
    case MenuKey.Deselect:
      board.deselect(true);
      break;
    case MenuKey.RemoveSelected:
      board.removeSelected(true);
      break;
    case MenuKey.ClearUp:
      board.removeAll(true);
      break;
    case MenuKey.InsertImage: {
      const input = document.createElement('input');
      input.accept = '.png,.jpeg,.jpg'
      input.type = 'file';
      input.multiple = true;
      input.title = '选择图片';
      input.onchange = () => {
        const { files } = input;
        if (!files) { return }
        for (let i = 0; i < files.length; ++i) {
          const file = files.item(i);
          if (!file) { continue; }
          const img = new Image();
          img.src = URL.createObjectURL(file)
          img.onload = () => {
            const shape = board.factory.newShape(ShapeEnum.Img) as ShapeImg;
            shape.data.src = img.src;
            shape.data.w = img.naturalWidth;
            shape.data.h = img.naturalHeight;
            shape.data.layer = board.layer().id;
            shape.data.objectFit = ObjectFit.Cover;
            board.add(shape, true);
          }
        }
      }
      input.click();
      break;
    }
    case MenuKey.ExportResult: {
      board.deselect(true);
      requestAnimationFrame(() => {
        const l = board.layer().onscreen;
        const c = document.createElement('canvas');
        c.width = l.width;
        c.height = l.height;
        c.getContext('2d')!.fillStyle = 'white';
        c.getContext('2d')!.fillRect(0, 0, l.width, l.height)
        c.getContext('2d')!.drawImage(l, 0, 0, l.width, l.height);

        const a = document.createElement('a');
        a.href = c.toDataURL('image/jpeg', 90);
        a.download = '' + Date.now() + '.jpg';
        a.click();
      })

    }
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

const blackboard = new View('div');
blackboard.styles.addCls('root', 'blackboard').apply('', {
  pointerEvents: 'all',
});
workspace.rootDockView.setContent(blackboard);

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
  ['Delete', () => board.removeSelected(true)]
])
const ctrlShorcuts = new Map<string, () => void>([
  ['a', () => board.selectAll(true)],
  ['d', () => board.deselect(true)],
])
// board.addEventListener(EventEnum.LayerAdded, e => {
//   e.detail.onscreen.addEventListener('keydown', onkeydown)
//   e.detail.onscreen.addEventListener('contextmenu', oncontextmenu)
// });
// board.addEventListener(EventEnum.LayerRemoved, e => {
//   e.detail.onscreen.removeEventListener('keydown', onkeydown)
//   e.detail.onscreen.removeEventListener('contextmenu', oncontextmenu)
// });
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