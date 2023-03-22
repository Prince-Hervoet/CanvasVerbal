import { ListNode } from "./../type/ObjectList";
import { Group } from "./../type/Group";
import { Edge } from "./../type/VerbalObject.js";
import { ControlBox } from "./../type/ControlBox.js";
import { Checkbox } from "./../type/Checkbox.js";
import { Point, VerbalObject } from "../type/VerbalObject.js";
import { ObjectList } from "../type/ObjectList.js";
import {
  anyCoordconver,
  CanvasVerbalStatusType,
  isInBoundingBox,
  judgeBoxSelection,
  radiographic,
} from "../util/common.js";
import { PitchOnBox } from "../type/PitchOnBox.js";

const BODY_DOM: any = document.querySelector("document");

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
  //* 第一层画布 用于处理鼠标事件
  private firstCanvas: HTMLCanvasElement | null = null;
  //* 第二层画布 用于渲染最后的结果
  private secondCanvas: HTMLCanvasElement | null = null;
  // 缓冲
  private bufferCanvas: HTMLCanvasElement | null = null;
  //* 父级元素 包装两层画布的父
  private boundingDiv: HTMLElement | null = null;
  // 第一层ctx
  private firstCtx: CanvasRenderingContext2D | null = null;
  // 第二层ctx
  private secondCtx: CanvasRenderingContext2D | null = null;
  // 元素列表
  protected objects: ObjectList = new ObjectList();
  // 当前选中  的物体
  private activeObject: VerbalObject | null = null;
  private activeObjectNode: ListNode | null = null;
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
    document.addEventListener("keydown", (event) => {
      CanvasVerbal.deleteObject(event, this);
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
      if (isInBoundingBox(mouseLeft, mouseTop, obj.boundingBoxEdges)) {
        if (radiographic(mouseLeft, mouseTop, obj.edges!)) {
          return { run, obj };
        }
      }
      run = run.front;
    }
    return { run: null, obj: null };
  };

  private static judgeSelection = (box: Edge[], canvasVerbal: CanvasVerbal) => {
    let run = canvasVerbal.objects.tail;
    let isOk = false;
    let minLeft = 9999999999;
    let minTop = 9999999999;
    let maxLeft = -1;
    let maxTop = -1;
    const groupArr = [];
    while (run && run !== canvasVerbal.objects.head) {
      const obj = run.val!;
      if (judgeBoxSelection(box, obj.boundingBoxEdges)) {
        groupArr.push(obj);
        isOk = true;
        minLeft = Math.min(minLeft, obj.boundingBoxp1.left);
        minLeft = Math.min(minLeft, obj.boundingBoxp2.left);
        minLeft = Math.min(minLeft, obj.boundingBoxp3.left);
        minLeft = Math.min(minLeft, obj.boundingBoxp4.left);

        minTop = Math.min(minTop, obj.boundingBoxp1.top);
        minTop = Math.min(minTop, obj.boundingBoxp2.top);
        minTop = Math.min(minTop, obj.boundingBoxp3.top);
        minTop = Math.min(minTop, obj.boundingBoxp4.top);

        maxLeft = Math.max(maxLeft, obj.boundingBoxp1.left);
        maxLeft = Math.max(maxLeft, obj.boundingBoxp2.left);
        maxLeft = Math.max(maxLeft, obj.boundingBoxp3.left);
        maxLeft = Math.max(maxLeft, obj.boundingBoxp4.left);

        maxTop = Math.max(maxTop, obj.boundingBoxp1.top);
        maxTop = Math.max(maxTop, obj.boundingBoxp2.top);
        maxTop = Math.max(maxTop, obj.boundingBoxp3.top);
        maxTop = Math.max(maxTop, obj.boundingBoxp4.top);
      }
      run = run.front;
    }
    if (isOk) {
      if (groupArr.length === 1) {
        return [
          groupArr[0].boundingBoxp1.left,
          groupArr[0].boundingBoxp1.top,
          groupArr[0].boundingBoxp3.left,
          groupArr[0].boundingBoxp3.top,
        ];
      }
      return [minLeft, minTop, maxLeft, maxTop];
    }
    return [-1, -1, -1, -1];
  };

  //? 单击事件
  private static singleClick = (event: any, canvasVerbal: CanvasVerbal) => {};

  //? 鼠标移动事件
  private static mouseMove = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const { run, obj } = CanvasVerbal.judgeMouseInObject(
      mouseLeft,
      mouseTop,
      canvasVerbal
    );
    switch (canvasVerbal.status) {
      case CanvasVerbalStatusType.NONE:
        if (obj) {
          // 高亮矩形
          canvasVerbal.status = CanvasVerbalStatusType.LIGHT;
          canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
          PitchOnBox.render(
            obj.sumLeft - 1,
            obj.sumTop - 1,
            obj.sumLeft + obj.sumWidth + 1,
            obj.sumTop + obj.sumHeight + 1,
            obj.rotation,
            canvasVerbal.firstCtx!
          );
        }
        break;
      case CanvasVerbalStatusType.LIGHT:
        if (!obj) {
          canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
          canvasVerbal.status = CanvasVerbalStatusType.NONE;
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
    const { run, obj } = CanvasVerbal.judgeMouseInObject(
      mouseLeft,
      mouseTop,
      canvasVerbal
    );
    //* 如果在物体上，则为选中状态
    if (obj) {
      canvasVerbal.status = CanvasVerbalStatusType.PITCH_ON;
      canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
      obj.isShow = false;
      canvasVerbal.activeObject = obj;
      canvasVerbal.activeObjectNode = run;
      canvasVerbal.render();
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

  //? 鼠标放开事件
  private static mouseUp = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    switch (canvasVerbal.status) {
      case CanvasVerbalStatusType.NONE:
        break;
      case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
        canvasVerbal.status = CanvasVerbalStatusType.NONE;
        const [left0, top0, width0, height0] = anyCoordconver(
          mouseLeft,
          mouseTop,
          canvasVerbal.commonMouseDownPoint[0],
          canvasVerbal.commonMouseDownPoint[1]
        );
        const p1 = new Point(left0, top0);
        const p2 = new Point(left0 + width0, top0);
        const p3 = new Point(left0 + width0, top0 + height0);
        const p4 = new Point(left0, top0 + height0);
        const e1 = new Edge(p1, p2);
        const e2 = new Edge(p2, p3);
        const e3 = new Edge(p3, p4);
        const e4 = new Edge(p4, p1);
        const edges = [];
        edges.push(e1);
        edges.push(e2);
        edges.push(e3);
        edges.push(e4);

        const ans = CanvasVerbal.judgeSelection(edges, canvasVerbal);

        canvasVerbal.commonMouseDownPoint[0] = 0;
        canvasVerbal.commonMouseDownPoint[1] = 0;
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        canvasVerbal.activeObject = null;
        if (ans[0] !== -1 && ans[1] !== -1 && ans[2] !== -1 && ans[3] !== -1) {
          // console.log("画一下: " + ans[2] + " " + ans[3]);
          ControlBox.render(
            ans[0],
            ans[1],
            ans[2] - ans[0],
            ans[3] - ans[1],
            0,
            canvasVerbal.firstCtx!
          );
          canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
        }
        break;
      case CanvasVerbalStatusType.PITCH_ON:
        canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        if (!canvasVerbal.activeObject) {
          break;
        }
        canvasVerbal.activeObject.isShow = true;
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
        //* 如果是从拖拽状态放开的情况，则修改状态为控制
        canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
        //* 健壮性
        if (!canvasVerbal.activeObject) {
          break;
        }
        //* 清除事件画布
        canvasVerbal.cleanAll(canvasVerbal.firstCtx!);
        //* 渲染到第二层画布上
        canvasVerbal.activeObject.isShow = true;
        canvasVerbal.render();
        //* 显示控制框
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

  private static deleteObject(event: any, canvasVeral: CanvasVerbal) {
    if (
      (canvasVeral.status === CanvasVerbalStatusType.CONTROL &&
        !canvasVeral.activeObject) ||
      !canvasVeral.activeObjectNode
    ) {
      return;
    }
    if (event.keyCode === 8) {
      canvasVeral.objects.deleteNode(canvasVeral.activeObjectNode);
      canvasVeral.activeObject = null;
      canvasVeral.activeObjectNode = null;
      canvasVeral.cleanAll(canvasVeral.firstCtx!);
      canvasVeral.render();
      canvasVeral.status = CanvasVerbalStatusType.NONE;
    }
  }
}
