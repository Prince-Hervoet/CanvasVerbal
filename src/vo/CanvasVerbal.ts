import { ControlBox } from "./../type/ControlBox.js";
import { Checkbox } from "./../type/Checkbox.js";
import { Point, VerbalObject } from "../type/VerbalObject.js";
import { ObjectList } from "../type/ObjectList.js";
import {
  CanvasVerbalStatusType,
  isInBoundingBox,
  radiographic,
} from "../util/common.js";
import { PitchOnBox } from "../type/PitchOnBox.js";

const BODY_DOM: any = document.querySelector("body");

//* 获取创建的canvas主类并将DOM添加到指定的父级元素中
export function canvasVerbal(
  id: string,
  width: number,
  height: number,
  styleInfo: any,
  parent: HTMLElement
) {
  //? 双层画布的包围元素
  const boundingDiv = document.createElement("div");
  boundingDiv.setAttribute("style", "position: relative;");
  boundingDiv;

  //? 下层画布DOM
  const secondCanvasDom: HTMLCanvasElement = document.createElement("canvas");
  secondCanvasDom.id = id;
  secondCanvasDom.width = width;
  secondCanvasDom.height = height;
  let styleStr = "";
  for (const s in styleInfo) {
    styleStr = s + ": " + styleInfo[s] + ";";
  }
  secondCanvasDom.setAttribute("style", styleStr);

  //? 上层画布DOM
  const firstCanvasDom: HTMLCanvasElement = document.createElement("canvas");
  firstCanvasDom.width = width;
  firstCanvasDom.height = height;
  firstCanvasDom.setAttribute(
    "style",
    "background-color: rgba(255,255,255,0); position: absolute; left:0; top:0;"
  );

  boundingDiv.appendChild(secondCanvasDom);
  boundingDiv.appendChild(firstCanvasDom);
  const cv = new CanvasVerbal(id, firstCanvasDom, secondCanvasDom, boundingDiv);
  parent.appendChild(boundingDiv);
  return cv;
}

// 画布主类，包含canvasDOM、上下文、状态机等
export class CanvasVerbal {
  private id: string;
  private width: number;
  private height: number;
  //! 第一层画布 用于处理鼠标事件
  private firstCanvas: HTMLCanvasElement | null = null;
  //! 第二层画布 用于渲染最后的结果
  private secondCanvas: HTMLCanvasElement | null = null;
  // 缓冲
  private bufferCanvas: HTMLCanvasElement | null = null;
  //! 父级元素 包装两层画布的父
  private boundingDiv: HTMLElement | null = null;
  // 第一层ctx
  private firstCtx: CanvasRenderingContext2D | null = null;
  // 第二层ctx
  private secondCtx: CanvasRenderingContext2D | null = null;
  // 元素列表
  protected objects: ObjectList = new ObjectList();
  // 当前选中  的物体
  private activeObject: VerbalObject | null = null;
  // 鼠标点击拖拽时，鼠标和物体左上角坐标的差值
  private activeMouseRemainObject: number[] = [];
  // 状态
  private status: number = 0;
  // 普通按下鼠标按键的起始点
  private commonMouseDownPoint: number[] = [];
  constructor(
    id: string,
    fitstCanvasDom: HTMLCanvasElement,
    secondCanvasDom: HTMLCanvasElement,
    boundingDiv: HTMLElement
  ) {
    //? 初始化各种dom和画布大小
    this.id = id;
    this.firstCanvas = fitstCanvasDom;
    this.secondCanvas = secondCanvasDom;
    this.firstCtx = fitstCanvasDom.getContext("2d");
    this.secondCtx = secondCanvasDom.getContext("2d");
    this.width = secondCanvasDom.width;
    this.height = secondCanvasDom.height;
    this.boundingDiv = boundingDiv;

    //? 在第一层画布上绑定事件
    this.initEventBinding(this.firstCanvas);
  }

  //? 添加对象方法
  public addObject(...args: VerbalObject[]) {
    args.forEach((el) => {
      this.objects.pushBack(el);
    });
    return this;
  }

  //? 将对象列表进行渲染
  public render() {
    this.cleanAll(this.secondCtx!);
    let run = this.objects.head?.next;
    while (run) {
      const obj = run.val;
      obj!.lastRender(this.secondCtx!);
      run = run.next;
    }
  }

  //? 在第一层渲染事件对象
  public eventRender(obj: VerbalObject) {
    if (!obj) {
      return;
    }
    this.cleanAll(this.firstCtx!);
    obj.lastRender(this.firstCtx!);
  }

  //? 清空画布
  public cleanAll(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);
  }

  //? 初始化事件绑定（绑定在第一层上）
  private initEventBinding = (canvasDom: HTMLCanvasElement) => {
    canvasDom.addEventListener("click", (event) => {
      CanvasVerbal.singleClick(event, this);
    });
    canvasDom.addEventListener("mousemove", (event) => {
      CanvasVerbal.mouseMove(event, this);
    });
    canvasDom.addEventListener("mousedown", (event) => {
      CanvasVerbal.mouseDown(event, this);
    });
    canvasDom.addEventListener("mouseup", (event) => {
      CanvasVerbal.mouseUp(event, this);
    });
  };

  //? 判断鼠标坐标是否在某个对象范围内
  private static judgeMouseInObject = (
    mouseLeft: number,
    mouseTop: number,
    canvasVerbal: CanvasVerbal
  ) => {
    //* 从后面往前面遍历，先得到的对象就是响应的层级最高的对象
    let run = canvasVerbal.objects.tail;
    while (run && run !== canvasVerbal.objects.head) {
      const obj = run.val!;
      if (
        isInBoundingBox(
          mouseLeft,
          mouseTop,
          obj.boundingBoxp1!,
          obj.boundingBoxp2!
        )
      ) {
        if (radiographic(mouseLeft, mouseTop, obj.edges!)) {
          return obj;
        }
      }
      run = run.front;
    }
    return null;
  };

  //? 单击事件
  private static singleClick = (event: any, canvasVerbal: CanvasVerbal) => {
    // const mouseLeft = event.clientX;
    // const mouseTop = event.clientY;
    // const obj = CanvasVerbal.judgeMouseInObject(
    //   mouseLeft,
    //   mouseTop,
    //   canvasVerbal
    // );
    // if (obj) {
    //   ControlBox.render(100, 100, 100, 100, 0, canvasVerbal.firstCtx!);
    // }
  };

  //? 鼠标移动事件
  private static mouseMove = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const obj = CanvasVerbal.judgeMouseInObject(
      mouseLeft,
      mouseTop,
      canvasVerbal
    );
    switch (canvasVerbal.status) {
      case CanvasVerbalStatusType.NONE:
        if (obj) {
          // 高亮矩形
          canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
          PitchOnBox.render(
            obj.sumLeft - 1,
            obj.sumTop - 1,
            obj.sumLeft + obj.sumWidth + 1,
            obj.sumTop + obj.sumHeight + 1,
            obj.rotation,
            canvasVerbal.firstCtx!
          );
        } else {
          canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        }
        break;
      case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
        // 显示复选矩形
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        Checkbox.render(
          canvasVerbal.commonMouseDownPoint[0],
          canvasVerbal.commonMouseDownPoint[1],
          mouseLeft,
          mouseTop,
          canvasVerbal.firstCtx!
        );
        break;

      case CanvasVerbalStatusType.PITCH_ON:
        // 拖拽
        if (canvasVerbal.activeObject) {
          canvasVerbal.status = CanvasVerbalStatusType.DRAGING;
          const newLeft = mouseLeft - canvasVerbal.activeMouseRemainObject[0];
          const newTop = mouseTop - canvasVerbal.activeMouseRemainObject[1];
          canvasVerbal.activeObject.changePosition(newLeft, newTop);
          canvasVerbal.eventRender(canvasVerbal.activeObject);
        }
        break;
      case CanvasVerbalStatusType.DRAGING:
        if (canvasVerbal.activeObject) {
          const newLeft = mouseLeft - canvasVerbal.activeMouseRemainObject[0];
          const newTop = mouseTop - canvasVerbal.activeMouseRemainObject[1];
          canvasVerbal.activeObject.changePosition(newLeft, newTop);
          canvasVerbal.eventRender(canvasVerbal.activeObject);
        }
        break;
    }
  };
  // 鼠标按下事件
  private static mouseDown = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const obj = CanvasVerbal.judgeMouseInObject(
      mouseLeft,
      mouseTop,
      canvasVerbal
    );
    //* 如果在物体上，则为选中状态
    if (obj) {
      canvasVerbal.status = CanvasVerbalStatusType.PITCH_ON;
      canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
      obj.isPitchOn = true;
      obj.isShow = false;
      canvasVerbal.activeObject = obj;
      canvasVerbal.render();
      obj.isPitchOn = true;
      obj.isShow = true;
      canvasVerbal.eventRender(obj);
      const remainX = mouseLeft - obj.left;
      const remainY = mouseTop - obj.top;
      canvasVerbal.activeMouseRemainObject[0] = remainX;
      canvasVerbal.activeMouseRemainObject[1] = remainY;
    } else {
      canvasVerbal.status = CanvasVerbalStatusType.COMMON_MOUSE_DOWN;
      canvasVerbal.commonMouseDownPoint[0] = mouseLeft;
      canvasVerbal.commonMouseDownPoint[1] = mouseTop;
    }
  };

  // 鼠标放开事件
  private static mouseUp = (event: any, canvasVerbal: CanvasVerbal) => {
    switch (canvasVerbal.status) {
      case CanvasVerbalStatusType.NONE:
        break;
      case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
        canvasVerbal.status = CanvasVerbalStatusType.NONE;
        canvasVerbal.commonMouseDownPoint[0] = 0;
        canvasVerbal.commonMouseDownPoint[1] = 0;
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        canvasVerbal.activeObject = null;
        break;
      case CanvasVerbalStatusType.PITCH_ON:
        canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        if (!canvasVerbal.activeObject) {
          break;
        }
        canvasVerbal.activeObject.isShow = true;
        canvasVerbal.activeObject.isPitchOn = true;
        const left1 = canvasVerbal.activeObject.sumLeft;
        const top1 = canvasVerbal.activeObject.sumTop;
        const width1 = canvasVerbal.activeObject.sumWidth;
        const height1 = canvasVerbal.activeObject.sumHeight;
        ControlBox.render(
          left1,
          top1,
          width1,
          height1,
          canvasVerbal.activeObject.rotation,
          canvasVerbal.firstCtx!
        );
        canvasVerbal.render();
        break;

      case CanvasVerbalStatusType.DRAGING:
        canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
        if (!canvasVerbal.activeObject) {
          break;
        }
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        canvasVerbal.activeObject.isShow = true;
        canvasVerbal.render();
        canvasVerbal.activeObject.isShow = true;
        canvasVerbal.activeObject.isPitchOn = true;
        const left2 = canvasVerbal.activeObject.sumLeft;
        const top2 = canvasVerbal.activeObject.sumTop;
        const width2 = canvasVerbal.activeObject.sumWidth;
        const height2 = canvasVerbal.activeObject.sumHeight;
        ControlBox.render(
          left2,
          top2,
          width2,
          height2,
          canvasVerbal.activeObject.rotation,
          canvasVerbal.firstCtx!
        );
        break;
    }
  };
}
