import {
  FactoryEnum, Gaia,
  ObjectFit,
  ShapeEnum,
  ShapeImg,
  ShapeText,
  TextData,
  ToolEnum
} from "../../dist";
import { EventEnum } from "../../dist/event";
import { EditPanel } from "./EditPanel";
import { Button } from "./G/BaseView/Button";
import { SizeType } from "./G/BaseView/SizeType";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";

const resultWidth = 600;
const resultHeight = 600;
const headerPicWidth = 600;
const headerPicHeight = resultHeight * 0.5;
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
      download();
      break;
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
  left: '50%',
  top: '40%',
  background: 'white',
}).view;

const resize = () => {
  const { width } = mainView.inner.getBoundingClientRect();
  blackboard.styles.apply('', v => ({
    ...v,
    transform: `translate(-50%,-50%) scale(${Math.min(1, width / resultWidth)})`
  }))
}
window.addEventListener('resize', resize)
resize();

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
  let lineWidth: number | undefined | null = null;
  let fontSize: number | undefined | null = null;

  board.selects.forEach(shape => {
    needFill = needFill || shape.data.needFill;
    needStroke = needStroke || shape.data.needStroke;
    needText = needText || shape.data.type === ShapeEnum.Text;
    needImg = needImg || shape.data.type === ShapeEnum.Img;
    if (shape.data.needStroke) {
      const temp = shape.data.lineWidth;
      if (lineWidth === null) {
        lineWidth = temp;
      } else if (lineWidth !== temp) {
        lineWidth = undefined;
      }
    }
    if (shape.data.type === ShapeEnum.Text) {
      const temp = (shape.data as TextData).font_size;
      if (fontSize === null) {
        fontSize = temp;
      } else if (fontSize !== temp) {
        fontSize = undefined;
      }
    }
  })

  editPanel.fontSizeInput.addEventListener('input', () => {
    board.selects.forEach(shape => {
      if (!(shape instanceof ShapeText)) {
        return;
      }
      const next = shape.data.copy();
      next.font_size = editPanel.fontSizeInput.num;
      shape.merge(next)
    })
  })

  editPanel.lineWidthInput.addEventListener('input', () => {
    board.selects.forEach(shape => {
      if (!shape.data.needStroke) {
        return;
      }
      const next = shape.data.copy();
      next.lineWidth = editPanel.lineWidthInput.num;
      shape.merge(next)
    })
  })

  editPanel.state.value.needFill = needFill;
  editPanel.state.value.needStroke = needStroke;
  editPanel.state.value.needText = needText;
  editPanel.state.value.needImg = needImg;
  editPanel.state.value.lineWidth = lineWidth ?? undefined;
  editPanel.state.value.fontSize = fontSize ?? undefined;

  console.log(editPanel.state.value)
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
  ['Delete', () => {
    board.removeSelected(true)
  }]
])
const ctrlShorcuts = new Map<string, () => void>([
  ['a', () => board.selectAll(true)],
  ['d', () => board.deselect(true)],
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

const init = (ttt: TTT) => {
  const img_header = (board.find('img_header') ?? board.factory.newShape(ShapeEnum.Img)) as ShapeImg;
  const imgd_header = img_header.data.copy();
  imgd_header.id = 'img_header';
  imgd_header.src = ttt.header.src;
  imgd_header.x = 0;
  imgd_header.y = 0;
  imgd_header.w = headerPicWidth;
  imgd_header.h = headerPicHeight;
  imgd_header.layer = board.layer().id;
  imgd_header.objectFit = ObjectFit.Cover;
  img_header.merge(imgd_header);
  img_header.board || board.add(img_header, true);

  const img_logo = (board.find('img_logo') ?? board.factory.newShape(ShapeEnum.Img)) as ShapeImg;
  const imgd_logo = img_logo.data.copy();
  imgd_logo.id = 'img_logo';
  imgd_logo.src = ttt.logo.src;
  imgd_logo.w = ttt.logo.w;
  imgd_logo.h = ttt.logo.h;
  imgd_logo.x = resultWidth - ttt.logo.w - 15;
  imgd_logo.y = resultHeight - ttt.logo.h - 15;
  imgd_logo.layer = board.layer().id;
  imgd_logo.objectFit = ObjectFit.Cover;
  img_logo.merge(imgd_logo);
  img_logo.board || board.add(img_logo, true);

  const txt_main_offset_y = 40
  const txt_main = (board.find('txt_content') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
  const txtd_main = txt_main.data.copy();
  txtd_main.id = 'txt_content';
  txtd_main.x = 20
  txtd_main.y = headerPicHeight + txt_main_offset_y;
  txtd_main.layer = board.layer().id;
  txtd_main.fillStyle = '#000000';
  txtd_main.font_size = ttt.main.font_size;
  txtd_main.font_family = ttt.main.font_family;
  txtd_main.text = ttt.main.text
  txt_main.merge(txtd_main);
  txt_main.board || board.add(txt_main, true);


  const now = new Date();
  const txt_date = (board.find('txt_date') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
  const txtd_date = txt_date.data.copy();
  txtd_date.id = 'txt_date'
  txtd_date.x = 20;
  txtd_date.y = resultHeight - 48 - 40;
  txtd_date.layer = board.layer().id;
  txtd_date.fillStyle = '#000000';
  txtd_date.font_size = 48;
  txtd_date.font_family = ttt.main.font_family;
  txtd_date.text = '' + now.getDate() + '.' + (now.getMonth() + 1);
  txt_date.merge(txtd_date);
  txt_date.merge(txtd_date);
  txt_date.board || board.add(txt_date, true);

  const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const txt_week_and_year = (board.find('txt_week_and_year') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
  const txtd_week_and_year = txt_week_and_year.data.copy();
  txtd_week_and_year.id = 'txt_week_and_year'
  txtd_week_and_year.x = 20;
  txtd_week_and_year.y = resultHeight - 12 - 20;
  txtd_week_and_year.layer = board.layer().id;
  txtd_week_and_year.fillStyle = '#000000';
  txtd_week_and_year.font_size = 12;
  txtd_week_and_year.font_family = ttt.main.font_family;
  txtd_week_and_year.text = weekDay[now.getDay()] + '. ' + now.getFullYear();
  txt_week_and_year.merge(txtd_week_and_year);
  txt_week_and_year.merge(txtd_week_and_year);
  txt_week_and_year.board || board.add(txt_week_and_year, true);
}

interface TTT {
  header: Img;
  main: Txt;
  logo: Logo;
}
interface Txt {
  font_family: string;
  font_size: number;
  text: string;
}
interface Img {
  src: string;
}
interface Logo {
  src: string;
  w: number,
  h: number,
}
const list: TTT[] = [{
  logo: { src: './logo.png', w: 100, h: 100 },
  header: { src: './brian-kernighan.jpg' },
  main: {
    font_size: 48,
    text: '"hello, world"',
    font_family: 'PingFang SC,Microsoft Yahei'
  }
}, {
  logo: { src: './logo.png', w: 100, h: 100 },
  header: { src: './header_0.jpg' },
  main: {
    font_size: 32,
    text: '垂死病中惊坐起，笑问客从何处来',
    font_family: 'PingFang SC,Microsoft Yahei'
  }
}, {
  logo: { src: './logo.png', w: 100, h: 100 },
  header: { src: './header_1.jpg' },
  main: {
    font_size: 32,
    text: '少壮不努力，自挂东南枝叶',
    font_family: 'PingFang SC,Microsoft Yahei'
  }
}, {
  logo: { src: './logo.png', w: 100, h: 100 },
  header: { src: './header_2.jpg' },
  main: {
    font_size: 32,
    text: '长亭外，古道边，一行白鹭上青天',
    font_family: 'PingFang SC,Microsoft Yahei'
  }
}]


const btnChange = new Button().init({ content: ' 换一个 ', size: SizeType.Large });
btnChange.styles.apply('', { left: 10, bottom: 10, position: 'absolute' })
let i = 0;
btnChange.addEventListener('click', () => {
  board.removeAll(false);
  init(list[(++i) % list.length]!);
})
btnChange.inner.click();
mainView.addChild(btnChange);

const btnExport = new Button().init({ content: '下载', size: SizeType.Large });
btnExport.styles.apply('', { left: 100, bottom: 10, position: 'absolute' })
btnExport.addEventListener('click', () => {
  download();
})
btnExport.inner.click();
mainView.addChild(btnExport);

const download = () => {
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
    a.href = c.toDataURL('image/png');
    a.download = '' + Date.now() + '.png';
    a.click();
  })
}

board.setToolType(ToolEnum.Selector);