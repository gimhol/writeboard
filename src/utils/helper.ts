export const isNum = (x: any): x is number => typeof x === 'number'
export const isStr = (x: any): x is string => typeof x === 'string'

export const findKey = (obj: any, value: any) => Object.keys(obj).find(k => obj[k] === value);
export const enumNameGetter = <T>(name: string, e: any) => (value: T) => {
  const k = findKey(e, value)
  return isStr(k) ? `${name}.${k}` : '' + value;
}