import {
  Board, FactoryEnum, Gaia,
  ObjectFit,
  ShapeEnum,
  ShapeImg,
  ShapeText,
  ToolEnum
} from "../../dist";
import { EventEnum } from "../../dist/event";
import { EditPanel } from "./EditPanel";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { State } from "./G/State";

const resultWidth = 600;
const resultHeight = 800;
const factory = Gaia.factory(FactoryEnum.Default)();

const mainView = View.get(document.body).styles.apply('', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  backgroundImage: 'url(./kiwihug-zGZYQQVmXw0-unsplash.jpg)',
  backgroundSize: '100% 100%'

}).view;

const editPanel = new EditPanel();

enum MenuKey {
  SelectAll = 'SelectAll',
  RemoveSelected = 'RemoveSelected',
  Deselect = 'Deselect',
  ClearUp = 'ClearUp',
  InsertImage = 'InsertImage',
  ExportResult = 'ExportResult',
}

const menu = new Menu(mainView).setup([{
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
}]);

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
            board.add(shape);
          }
        }
      }
      input.click();
      break;
    }
    case MenuKey.ExportResult: {
      board.deselect();
      requestAnimationFrame(() => {
        const l = board.layer().onscreen;
        const c = document.createElement('canvas');
        c.width = l.width;
        c.height = l.height;
        c.getContext('2d')!.fillStyle = 'white';
        c.getContext('2d')!.fillRect(0, 0, l.width, l.height)
        c.getContext('2d')!.drawImage(l, 0, 0, l.width, l.height);

        const a = document.createElement('a');
        a.href = c.toDataURL('image/png');
        a.download = '' + Date.now() + '.png';
        a.click();
      })
    }
  }
});

const blackboard = new View('div').styles.apply('', {
  boxShadow: '3px 3px 10px 1px #00000011',
  width: resultWidth,
  height: resultHeight,
  boxSizing: 'border-box',
  borderRadius: 5,
  overflow: 'hidden',
  position: 'absolute',
  transformOrigin: '50% 50%',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  margin: 'auto',
  background: 'white',
}).view;

const contentZone = new View('div');
contentZone.styles.apply('', {
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
})
contentZone.addChild(blackboard);

mainView.addChild(contentZone, editPanel);

const board = factory.newWhiteBoard({
  width: resultWidth,
  height: resultHeight,
  element: blackboard.inner,
});

const updateEditPanel = () => {
  let needFill = false;
  let needStroke = false;
  let needText = false;
  let needImg = false;

  board.selects.forEach(shape => {
    needFill = needFill || shape.data.needFill;
    needStroke = needStroke || shape.data.needStroke;
    needText = needText || shape.data.type === ShapeEnum.Text;
    needImg = needImg || shape.data.type === ShapeEnum.Img;
  })
  editPanel.state.value.needFill = needFill;
  editPanel.state.value.needStroke = needStroke;
  editPanel.state.value.needText = needText;
  editPanel.state.value.needImg = needImg;
}

board.addEventListener(EventEnum.ShapesSelected, e => {
  updateEditPanel();
})
board.addEventListener(EventEnum.ShapesDeselected, e => {
  updateEditPanel();
})
Object.assign(window, {
  board, factory, mainView, Gaia, menu
});

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
})

window.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'a') {
    e.stopPropagation();
  }
})