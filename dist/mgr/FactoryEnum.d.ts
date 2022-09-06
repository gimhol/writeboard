export declare enum FactoryEnum {
    Invalid = 0,
    Default = 1
}
export declare type FactoryType = FactoryEnum | string;
export declare function getFactoryName(type: FactoryType): string;
