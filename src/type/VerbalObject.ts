import { BrushAttributeType } from "../util/common.js";

//! 点
export class Point {
  public left: number = 0;
  public top: number = 0;

  constructor(left: number, top: number) {
    this.left = left;
    this.top = top;
  }
}

//! 边
export class Edge {
  public p1: Point | null = null;
  public p2: Point | null = null;

  constructor(p1: Point, p2: Point) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

//! 附加风格
export class StyleInfo {
  fill: string = "";
  border_size: number = 0;
  border_color: string = "";
}

//! 基础风格
export interface IBaseStyleInfo {
  width: number;
  height: number;
  left: number;
  top: number;
}

//! 对象基类
export class VerbalObject {
  //* 内容位置
  public left: number = 0;
  public top: number = 0;
  //* 内容大小
  public width: number = 0;
  public height: number = 0;

  //* 加上描边的总大小
  public sumLeft: number = 0;
  public sumTop: number = 0;
  public sumWidth: number = 0;
  public sumHeight: number = 0;

  //* 包围盒位置
  public boundingBoxp1: Point = new Point(0, 0);
  public boundingBoxp2: Point = new Point(0, 0);
  public boundingBoxp3: Point = new Point(0, 0);
  public boundingBoxp4: Point = new Point(0, 0);

  // 边
  public edges: Edge[] = [];
  public boundingBoxEdges: Edge[] = [];

  // style
  public styleInfo: StyleInfo = { fill: "", border_size: 0, border_color: "" };

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

  constructor(baseStyleInfo: IBaseStyleInfo, styleInfo: StyleInfo) {
    //* 生成一个id
    const id = "object_" + Date.now().toString();
    this.objectId = id;

    //* 基础属性赋值
    const that: any = this;
    const baseT: any = baseStyleInfo;
    for (const base in baseStyleInfo) {
      if (base in this) {
        that[base] = baseT[base];
      }
    }

    //* 附加属性赋值
    this.styleInfo = styleInfo;
    //* 计算加上描边的总大小
    this.calculatePosition(styleInfo);
    this.setBoundingBox();
  }

  protected render(ctx: CanvasRenderingContext2D) {}

  protected setEdges() {}

  //? 设置ctx的颜色等
  protected setCtx(ctx: CanvasRenderingContext2D) {
    const that = this.styleInfo;
    ctx.strokeStyle = "#f00";
    ctx.fillStyle = "#f00";
    for (const a of BrushAttributeType) {
      if (a in that) {
        switch (a) {
          case "fill":
            if (that[a]) {
              ctx.fillStyle = that[a];
            }
            break;
          case "border_color":
            if (that[a]) {
              ctx.strokeStyle = that[a];
            }
            break;
          case "border_size":
            if (that[a]) {
              ctx.lineWidth = that[a];
            }
            break;
        }
      }
    }
  }

  public setBoundingBox() {
    //* 计算包围盒大小
    this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
    this.boundingBoxp2 = new Point(this.sumLeft + this.sumWidth, this.sumTop);
    this.boundingBoxp3 = new Point(
      this.sumLeft + this.sumWidth,
      this.sumTop + this.sumHeight
    );
    this.boundingBoxp4 = new Point(this.sumLeft, this.sumTop + this.sumHeight);

    const e1 = new Edge(this.boundingBoxp1, this.boundingBoxp2);
    const e2 = new Edge(this.boundingBoxp2, this.boundingBoxp3);
    const e3 = new Edge(this.boundingBoxp3, this.boundingBoxp4);
    const e4 = new Edge(this.boundingBoxp4, this.boundingBoxp1);

    this.boundingBoxEdges = [];
    this.boundingBoxEdges.push(e1);
    this.boundingBoxEdges.push(e2);
    this.boundingBoxEdges.push(e3);
    this.boundingBoxEdges.push(e4);
  }

  //? 改变位置的重新计算函数
  public changePosition(newLeft: number, newTop: number) {
    this.left = newLeft;
    this.top = newTop;
    this.calculatePosition(this.styleInfo);
    this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
    this.boundingBoxp2 = new Point(
      this.sumLeft + this.sumWidth,
      this.sumTop + this.sumHeight
    );
    this.setEdges();
    this.setBoundingBox();
  }

  //? 计算描边
  protected calculatePosition(styleInfo: any) {
    const key = "border_size";
    if (key in styleInfo) {
      this.sumWidth = this.width + styleInfo[key];
      this.sumHeight = this.height + styleInfo[key];
      this.sumLeft = this.left - styleInfo[key] / 2;
      this.sumTop = this.top - styleInfo[key] / 2;
    }
  }

  public lastRender(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.setCtx(ctx);
    this.render(ctx);
    ctx.restore();
  }
}
