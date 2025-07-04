import { ShapeData, ShapeRect } from "../../shape";

export class Indicator extends ShapeRect {
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 1
    this.data.strokeStyle = '#00000055'
    this.data.fillStyle = '#FFFFFF55'
    // this.data.ghost = true;
    this.data.w = 100;
    this.data.h = 100;
  }
}
