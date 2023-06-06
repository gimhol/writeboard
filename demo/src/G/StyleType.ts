
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
export interface Style extends Partial<Omit<CSSStyleDeclaration,
  'length' | 'parentRule' |

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
  'borderBottomRightRadius'
>> {
  flex?: number | string;
  objectFit?: CssObjectFit | 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
  position?: CssPosition | 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  display?: 'block' |
  'inline' |
  'inline-block' |
  'flex' |
  'inline-flex' |
  'grid' |
  'inline-grid' |
  'flow-root' |
  'none' |
  'contents' |
  'table' |
  'table-row' |
  'list-item' |
  'inherit' |
  'initial' |
  'revert' |
  'revert-layer' |
  'unset';
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
};