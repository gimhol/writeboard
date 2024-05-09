export interface IMenuItemInfo<K extends string | number | symbol> {
  key?: K;
  divider?: boolean;
  danger?: boolean;
  icon?: string;
  label?: string;
  items?: IMenuItemInfo<K>[];
  zIndex?: number;
}
