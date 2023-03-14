import { VOElement } from "./type";
import { nanoid } from "nanoid";
import { ElementList } from "./data_struct";

const CANVAS_MAP = new Map();
class CanvasVO {
  #canvasDOM;
  #elementList: ElementList;
  constructor(canvasDOM) {
    this.#canvasDOM = canvasDOM;
    this.#elementList = new ElementList();
  }

  addElement(element: VOElement) {
    this.#elementList.pushBack(element);
  }

  judgePointInElement(left: number, top: number) {
    const tail = this.#elementList.getTail();
    while (tail) {}
  }
}

function bindEvents(dom: any) {
  dom.addEventListener("click", (e) => {});
  dom.addEventListener("mousedown", (e) => {});
  dom.addEventListener("mouseup", (e) => {});
  dom.addEventListener("mousemove", (e) => {});
}

// 判断鼠标点击位置
function judgeClickPosition(event) {
  const e = event.target;
  const canvasId = e.id;
  const cvo = CANVAS_MAP.get(canvasId);
  if (!cvo) {
    return;
  }

  const left = event.clientX;
  const right = event.clientY;
}

// 判断鼠标移动的位置
function judgeMouseMovePosition(x: number, y: number, canvasId: string) {}

export function newCanvasVO(id) {
  const canvasDOM = document.createElement("canvas");
  canvasDOM.id = id;
  const cvo = new CanvasVO(canvasDOM);
  CANVAS_MAP.set(id, cvo);
  return cvo;
}

export function getCanvasByName(name: string) {
  return CANVAS_MAP.get(name);
}
