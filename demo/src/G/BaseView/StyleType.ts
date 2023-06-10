
export enum CssObjectFit {
  Fill = 'fill',
  Contain = 'contain',
  Cover = 'cover',
  None = 'none',
  scaleDown = 'scale-down'
}
export enum CssPosition {
  Static = 'static',
  Relative = 'relative',
  Absolute = 'absolute',
  Fixed = 'fixed',
  Sticky = 'sticky',
}
export enum CssFlexDirection {
  row = 'row',
  rowReverse = 'row-reverse',
  column = 'column',
  columnReverse = 'column-reverse'
}
export enum CssCursor {
  Auto = 'auto',
  Default = 'default',
  None = 'none',
  ContextMenu = 'context-menu',
  Help = 'help',
  Pointer = 'pointer',
  Progress = 'progress',
  Wait = 'wait',
  Cell = 'cell',
  Crosshair = 'crosshair',
  Text = 'text',
  VerticalText = 'vertical-text',
  Alias = 'alias',
  Copy = 'copy',
  Move = 'move',
  NoDrop = 'no-drop',
  NotAllowed = 'not-allowed',
  Grab = 'grab',
  Grabbing = 'grabbing',
  AllScroll = 'all-scroll',
  ResizeCol = 'col-resize',
  ResizeRow = 'row-resize',
  ResizeN = 'n-resize',
  ResizeE = 'e-resize',
  ResizeS = 's-resize',
  ResizeW = 'w-resize',
  ResizeNE = 'ne-resize',
  ResizeNW = 'nw-resize',
  ResizeSE = 'se-resize',
  ResizeSW = 'sw-resize',
  ResizeEW = 'ew-resize',
  ResizeNS = 'ns-resize',
  ResizeNESW = 'nesw-resize',
  ResizeNWSE = 'nwse-resize',
  ZoomIn = 'zoom-in',
  ZoomOut = 'zoom-out',
}
type OverrideKeys = 'length' | 'parentRule' |
  'flex' |
  'objectFit' |
  'position' |
  'display' |
  'width' |
  'height' |
  'maxWidth' |
  'maxHeight' |
  'minWidth' |
  'minHeight' |
  'left' |
  'right' |
  'top' |
  'bottom' |
  'borderRadius' |
  'fontSize' |
  'lineHeight' |
  'padding' |
  'paddingLeft' |
  'paddingRight' |
  'paddingBottom' |
  'paddingTop' |
  'margin' |
  'marginLeft' |
  'marginRight' |
  'marginBottom' |
  'marginTop' |
  'borderRadius' |
  'borderTopLeftRadius' |
  'borderTopRightRadius' |
  'borderBottomLeftRadius' |
  'borderBottomRightRadius' |
  'opacity' |
  'zIndex' |
  'flexDirection' |
  'cursor'

export enum CssDisplay {
  Block = 'block',
  Inline = 'inline',
  InlineBlock = 'inline-block',
  Flex = 'flex',
  InlineFlex = 'inline-flex',
  Grid = 'grid',
  InlineGrid = 'inline-grid',
  FlowRoot = 'flow-root',
  None = 'none',
  Contents = 'contents',
  Table = 'table',
  TableRow = 'table-row',
  ListItem = 'list-item',
  Inherit = 'inherit',
  Initial = 'initial',
  Revert = 'revert',
  RevertLayer = 'revert-layer',
  Unset = 'unset',
}

export interface Style extends Partial<Omit<CSSStyleDeclaration, OverrideKeys>> {
  flex?: number | string;
  objectFit?: CssObjectFit | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  position?: CssPosition | 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  display?: CssDisplay | 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' |
  'flow-root' | 'none' | 'contents' | 'table' | 'table-row' | 'list-item' | 'inherit' | 'initial' | 'revert' |
  'revert-layer' | 'unset';
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  left?: number | string;
  right?: number | string;
  top?: number | string;
  bottom?: number | string;
  borderRadius?: number | string;
  fontSize?: number | string;
  lineHeight?: number | string;
  borderTopLeftRadius?: number | string;
  borderTopRightRadius?: number | string;
  borderBottomLeftRadius?: number | string;
  borderBottomRightRadius?: number | string;
  padding?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingBottom?: number | string;
  paddingTop?: number | string;
  margin?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginBottom?: number | string;
  marginTop?: number | string;
  opacity?: number | string;
  zIndex?: number | string;
  flexDirection?: CssFlexDirection | 'row' | 'row-reverse' | 'column' | 'column-reverse'
  cursor?: CssCursor | 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' |
  'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'grab' |
  'grabbing' | 'all-scroll' | 'col-resize' | 'row-resize' | 'n-resize' | 'e-resize' | 's-resize' | 'w-resize' |
  'ne-resize' | 'nw-resize' | 'se-resize' | 'sw-resize' | 'ew-resize' | 'ns-resize' | 'nesw-resize' | 'nwse-resize' |
  'zoom-in' | 'zoom-out'
};

export const autoPxKeys = new Set<keyof Style>([
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight',
  'left',
  'right',
  'top',
  'bottom',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'fontSize',
  'lineHeight',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingBottom',
  'paddingTop',
  'margin',
  'marginLeft',
  'marginRight',
  'marginBottom',
  'marginTop',
])