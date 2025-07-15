import { enumNameGetter } from "../utils/helper"

export enum FactoryEnum {
  Invalid = 0,
  Default = 1,
}
export type FactoryType = FactoryEnum | string
export const getFactoryName = enumNameGetter<FactoryType>("FactoryEnum", FactoryEnum)