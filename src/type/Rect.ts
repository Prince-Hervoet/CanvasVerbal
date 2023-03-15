import { BaseShapeType } from "../util/common";
import { VerbalObject } from "./VerbalObject";

class Rect extends VerbalObject {
  public rx: number = 0;
  public ry: number = 0;
  public shapeName: string = BaseShapeType.RECT;

  constructor(args: object) {
    super();
  }

  protected render(ctx: CanvasRenderingContext2D) {}
}
