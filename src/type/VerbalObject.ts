import { BrushAttributeType } from "../util/common.js";

export class Point {
  public left: number = 0;
  public top: number = 0;

  constructor(left: number, top: number) {
    this.left = left;
    this.top = top;
  }
}

export class Edge {
  public p1: Point | null = null;
  public p2: Point | null = null;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

export class VerbalObject {
  // 位置大小
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;

  public boundingBoxp1: Point | null = null;
  public boundingBoxp2: Point | null = null;

  // 边
  public edges: Edge[] | null = null;

  // style
  public styleInfo: any = {};

  // 放大缩小
  public scaleX: number = 0;
  public scaleY: number = 0;

  // 旋转角度
  public rotation: number = 0;

  // 形状类型
  public shapeName: string = "object";
  // id
  public objectId: string = "default";
  // 是否被选中
  public isPitchOn: boolean = false;
  // 是否可视
  public isShow: boolean = true;
  // 是否描边
  public isStroke: boolean = true;

  constructor() {
    const id = Date.now().toString(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'();
    this.objectId = id;
  }

  protected render(ctx: CanvasRenderingContext2D) {}

  protected setCtx(ctx: CanvasRenderingContext2D) {
    const that: any = this.styleInfo;
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "#f00";
    for (const a of BrushAttributeType) {
      if (a in that) {
        switch (a) {
          case "fill":
            ctx.fillStyle = that[a];
            break;
          case "border-color":
            ctx.strokeStyle = that[a];
            break;
          case "border-size":
            ctx.lineWidth = that[a];
            break;
        }
      }
    }
  }

  public lastRender(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.setCtx(ctx);
    this.render(ctx);
    ctx.restore();
  }
}
