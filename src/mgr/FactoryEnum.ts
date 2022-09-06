export enum FactoryEnum {
  Invalid = 0,
  Default = 1,
}
export type FactoryType = FactoryEnum | string
export function getFactoryName(type: FactoryType): string {
  switch (type) {
    case FactoryEnum.Invalid: return 'FactoryEnum.Invalid'
    case FactoryEnum.Default: return 'FactoryEnum.Default'
    default: return type
  }
}