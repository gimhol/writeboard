import {
  FactoryEnum, Gaia,
  ObjectFit,
  SelectorTool,
  ShapeEnum,
  ShapeImg,
  ShapeText,
  TextData,
  TextTool,
  ToolEnum
} from "../../dist";
import { EventEnum } from "../../dist/event";
import { EditPanel } from "./EditPanel";
import { Button } from "./G/BaseView/Button";
import { SizeType } from "./G/BaseView/SizeType";
import { Styles } from "./G/BaseView/Styles";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { Shiftable } from "./Shiftable";

Styles.css(
  './calendar_phrases/styles/index.css',
  './calendar_phrases/styles/edit_panel.css'
);

View.get(document.head).addChild(
  new View('title', '每日一句'),
  new View('link')
    .setAttribute('rel', 'icon')
    .setAttribute('sizes', '16x16')
    .setAttribute('href', './calendar_phrases/logo.png')
);


const resultWidth = 600;
const resultHeight = 600;
const headerPicWidth = 600;
const headerPicHeight = resultHeight * 0.5;
const factory = Gaia.factory(FactoryEnum.Default)();

const mainView = View.get(document.body).styles.addCls('g_cp_main_view').view;

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

const blackboard = new View('div').styles
  .addCls('g_cp_blackboard')
  .apply('size', {
    width: resultWidth,
    height: resultHeight,
  }).view;

const resize = () => {
  const { width } = mainView.inner.getBoundingClientRect();
  blackboard.styles.apply('transform', {
    transform: `translate(-50%,-50%) scale(${Math.min(1, width / resultWidth)})`
  })
}
window.addEventListener('resize', resize)
resize();

const contentZone = new View('div');
contentZone.styles.addCls('g_cp_content_zone')
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
  const { tool, selects } = board
  if (
    tool instanceof SelectorTool &&
    !tool.rect.ok &&
    !isNaN(tool.rect.from.x) &&
    selects.length === 1 &&
    selects[0] instanceof ShapeText
  ) {
    board.setToolType(ToolEnum.Text);
    const textTool = board.tool as TextTool;
    textTool.connectShapeText(selects[0]);
    textTool.editor.addEventListener('blur', () => {
      board.setToolType(ToolEnum.Selector);
    }, { once: true })
  } else {
    updateEditPanel();
  }
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
  board.removeAll(false);
  const img_header = (board.find('img_header') ?? board.factory.newShape(ShapeEnum.Img)) as ShapeImg;
  const imgd_header = img_header.data.copy();
  imgd_header.id = 'img_header';
  imgd_header.src = ttt.main_pic.src;
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
  imgd_logo.src = ttt.logo_img.src;
  imgd_logo.w = ttt.logo_img.w;
  imgd_logo.h = ttt.logo_img.h;
  imgd_logo.x = resultWidth - ttt.logo_img.w - 15;
  imgd_logo.y = resultHeight - ttt.logo_img.h - 15;
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
  txtd_main.font_size = 32;
  txtd_main.text = ttt.main_txt.text
  txt_main.merge(txtd_main);
  txt_main.board || board.add(txt_main, true);


  const now = new Date();
  const txt_date = (board.find('txt_date') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
  const txtd_date = txt_date.data.copy();
  txtd_date.id = 'txt_date'
  txtd_date.x = 20;
  txtd_date.y = resultHeight - 48 - 40;
  txtd_date.layer = board.layer().id;
  txtd_date.font_size = 48;
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
  txtd_week_and_year.font_size = 12;
  txtd_week_and_year.text = weekDay[now.getDay()] + '. ' + now.getFullYear();
  txt_week_and_year.merge(txtd_week_and_year);
  txt_week_and_year.merge(txtd_week_and_year);
  txt_week_and_year.board || board.add(txt_week_and_year, true);
}

interface TTT {
  main_pic: Img;
  main_txt: Txt;
  logo_img: Logo;
}
interface Txt { text: string; }
interface Img { src: string; }
interface Logo {
  src: string;
  w: number,
  h: number,
}

const templateText = board.factory.shapeTemplate(ShapeEnum.Text) as TextData;
templateText.font_family = 'PingFang SC, Microsoft Yahei';
templateText.fillStyle = '#000000'

const main_pics = new Shiftable([
  './calendar_phrases/main_pics/header_0.jpg',
  './calendar_phrases/main_pics/header_1.jpg',
  './calendar_phrases/main_pics/header_2.jpg',
  './calendar_phrases/main_pics/header_3.jpg',
])
const main_txts = new Shiftable([
  '垂死病中惊坐起，笑问客从何处来',
  '少壮不努力，自挂东南枝叶',
  '长亭外，古道边，一行白鹭上青天',
  '"hello, world"',
]);

const builtins = new Shiftable([{
  logo_img: { src: './calendar_phrases/logo.png', w: 100, h: 100 },
  main_pic: { src: main_pics.next()! },
  main_txt: { text: main_txts.next()! }
}, {
  logo_img: { src: './calendar_phrases/logo.png', w: 100, h: 100 },
  main_pic: { src: main_pics.next()! },
  main_txt: { text: main_txts.next()! }
}, {
  logo_img: { src: './calendar_phrases/logo.png', w: 100, h: 100 },
  main_pic: { src: main_pics.next()! },
  main_txt: { text: main_txts.next()! }
}, {
  logo_img: { src: './calendar_phrases/logo.png', w: 100, h: 100 },
  main_pic: { src: main_pics.next()! },
  main_txt: { text: main_txts.next()! }
}])

const btnNext = new Button().init({ content: '符号', size: SizeType.Large });
btnNext.addEventListener('click', () => {
  init(builtins.next()!);
})
btnNext.inner.click();

const btnExport = new Button().init({ content: '下载', size: SizeType.Large });
btnExport.addEventListener('click', () => download())

const bottomRow = new View('div');
bottomRow.styles.addCls('g_cp_content_bottom_row')
bottomRow.addChild(btnNext, btnExport)
mainView.addChild(bottomRow);

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