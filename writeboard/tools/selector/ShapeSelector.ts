import { ShapeData, ShapeRect } from "../../shape";

export class ShapeSelector extends ShapeRect {
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 2
    this.data.strokeStyle = '#003388FF'
    this.data.fillStyle = '#00338855'
    this.data.ghost = true;
  }
}
