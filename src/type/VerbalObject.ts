import { nanoid } from "../../node_modules/nanoid/index";

class Point {
  public left: number = 0;
  public top: number = 0;
}

class Edge {
  public p1: Point | null = null;
  public p2: Point | null = null;
}

export class VerbalObject {
  // 包围盒位置大小
  public left: number = 0;
  public top: number = 0;
  public width: number = 0;
  public height: number = 0;

  // 边
  public edges: Edge[] | null = null;

  // style
  public styleInfo: object = {};

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
  // 是否填充
  public isFill: boolean = false;
  // 是否描边
  public isStroke: boolean = true;

  constructor() {
    const id = nanoid();
    this.objectId = id;
  }

  protected render(ctx: CanvasRenderingContext2D) {}

  public lastRender(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.render(ctx);
    ctx.restore();
  }
}
