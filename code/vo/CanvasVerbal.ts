import { Point, VerbalObject } from "../type/VerbalObject.js";
import { ObjectList } from "../type/ObjectList.js";
import { isInBoundingBox, radiographic } from "../util/common.js";

const BODY_DOM: any = document.querySelector("body");
export function canvasVerbal(
  id: string,
  width: number,
  height: number,
  styleInfo: any,
  parent: HTMLElement
) {
  // 双层画布的包围元素
  const boundingDiv = document.createElement("div");
  boundingDiv.setAttribute("style", "position: relative;");
  boundingDiv;

  // 下层画布DOM
  const secondCanvasDom: HTMLCanvasElement = document.createElement("canvas");
  secondCanvasDom.id = id;
  secondCanvasDom.width = width;
  secondCanvasDom.height = height;
  let styleStr = "";
  for (const s in styleInfo) {
    styleStr = s + ": " + styleInfo[s] + ";";
  }
  secondCanvasDom.setAttribute("style", styleStr);

  // 上层画布DOM
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

export class CanvasVerbal {
  private id: string;
  private width: number;
  private height: number;
  // 第一层画布
  private firstCanvas: HTMLCanvasElement | null = null;
  // 第二层画布
  private secondCanvas: HTMLCanvasElement | null = null;
  // 缓冲
  private bufferCanvas: HTMLCanvasElement | null = null;
  // 父级元素
  private boundingDiv: HTMLElement | null = null;
  // 第一层ctx
  private firstCtx: CanvasRenderingContext2D | null = null;
  // 第二层ctx
  private secondCtx: CanvasRenderingContext2D | null = null;
  // 元素列表
  protected objects: ObjectList = new ObjectList();
  // 当前选中的物体
  private activeObjectId: string | null = null;
  // 是否处于拖拽状态
  private isDraging: boolean = false;
  constructor(
    id: string,
    fitstCanvasDom: HTMLCanvasElement,
    secondCanvasDom: HTMLCanvasElement,
    boundingDiv: HTMLElement
  ) {
    this.id = id;
    this.firstCanvas = fitstCanvasDom;
    this.secondCanvas = secondCanvasDom;
    this.firstCtx = fitstCanvasDom.getContext("2d");
    this.secondCtx = secondCanvasDom.getContext("2d");
    this.width = secondCanvasDom.width;
    this.height = secondCanvasDom.height;
    this.boundingDiv = boundingDiv;

    this.initEventBinding(this.firstCanvas);
  }

  public addObject(...args: VerbalObject[]) {
    args.forEach((el) => {
      this.objects.pushBack(el);
    });
  }

  public render() {
    this.cleanAll();
    let run = this.objects.head?.next;
    while (run) {
      const obj = run.val;
      obj!.lastRender(this.secondCtx!);
      run = run.next;
    }
  }

  public cleanAll() {
    this.secondCtx?.clearRect(0, 0, this.width, this.height);
  }

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
  };

  // 单击事件
  private static singleClick = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.clientX;
    const mouseTop = event.clientY;

    let run = canvasVerbal.objects.head?.next;
    while (run) {}
  };

  // 鼠标移动事件
  private static mouseMove = (event: any, canvasVerbal: CanvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    let run = canvasVerbal.objects.head?.next;
    while (run) {
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
          console.log("进入了");
          return;
        }
      }
      run = run.next;
    }
  };
  // 鼠标按下事件
  private static mouseDown = (event: any, canvasVerbal: CanvasVerbal) => {};
}
