
export interface Style extends Partial<Omit<CSSStyleDeclaration, 'flex'>> {
  flex?: number | string;
}