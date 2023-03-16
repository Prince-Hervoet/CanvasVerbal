import { VerbalObject } from "../type/VerbalObject.js";
import { ObjectList } from "../type/ObjectList.js";
import { send } from "process";

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
    "background-color: blue; position: absolute; left:0; top:0;"
  );

  boundingDiv.appendChild(secondCanvasDom);
  boundingDiv.appendChild(firstCanvasDom);
  const cv = new CanvasVerbal(id, firstCanvasDom, secondCanvasDom, boundingDiv);
  parent.appendChild(boundingDiv);
  return cv;
}

class CanvasVerbal {
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

  private firstCtx: CanvasRenderingContext2D | null = null;
  private secondCtx: CanvasRenderingContext2D | null = null;
  // 元素列表
  private objects: ObjectList = new ObjectList();

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
  }

  public addObject(...args: VerbalObject[]) {
    args.forEach((el) => {
      this.objects.pushBack(el);
    });
  }

  public render() {
    this.cleanAll();
    let run = this.objects.head!.next;
    while (run) {
      const obj = run.val;
      obj!.lastRender(this.secondCtx!);
      run = run.next;
    }
  }

  public cleanAll() {
    this.secondCtx?.clearRect(0, 0, this.width, this.height);
  }
}
