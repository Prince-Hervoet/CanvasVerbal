import { VerbalObject } from "../type/VerbalObject";
import { ObjectList } from "../type/ObjectList";

export function canvasVerbal(
  id: string,
  width: number,
  height: number,
  styleInfo: any,
  parent: HTMLElement
) {
  const dom: HTMLCanvasElement =
    (document.getElementById(id) as HTMLCanvasElement) ||
    document.createElement("canvas");
  dom.id = id;
  dom.width = width;
  dom.height = height;
  for (const s in styleInfo) {
    dom.setAttribute(s, styleInfo[s]);
  }
  parent.appendChild(dom);
  const cv = new CanvasVerbal(id, dom);
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
  private parentElement: HTMLElement | null = null;

  private firstCtx: CanvasRenderingContext2D | null = null;
  private secondCtx: CanvasRenderingContext2D | null = null;
  // 元素列表
  private objects: ObjectList = new ObjectList();

  constructor(id: string, canvasDom: HTMLCanvasElement) {
    this.id = id;
    this.firstCanvas = canvasDom;
    this.secondCanvas = canvasDom;
    this.firstCtx = canvasDom.getContext("2d");
    this.secondCtx = canvasDom.getContext("2d");
    this.width = canvasDom.width;
    this.height = canvasDom.height;
  }

  public addObject(...args: VerbalObject[]) {
    args.forEach((el) => {
      this.objects.pushBack(el);
    });
  }

  public render() {
    this.cleanAll();
    let run = this.objects.head;
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
