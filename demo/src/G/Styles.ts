
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
  'flex' |
  'objectFit' |
  'position' |
  'display'
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
  'unset'
};