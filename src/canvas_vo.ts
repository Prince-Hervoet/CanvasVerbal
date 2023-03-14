import { VOElement } from "./type";
import { nanoid } from "nanoid";
import { ElementList } from "./data_struct";
import { BASE_SHAPE_TYPE } from "./util";

const CANVAS_MAP = new Map();

export function newCanvasVO(name) {
  const canvasDOM = document.createElement("canvas");
  const cvo = new CanvasVO(canvasDOM);
  CANVAS_MAP.set(name, cvo);
  return cvo;
}

export function getCanvasByName(name: string) {
  return CANVAS_MAP.get(name);
}

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
}

function getRect(
  left: number,
  top: number,
  width: number,
  height: number,
  info: object
) {
  const id = nanoid();
  const ve = new VOElement();
  ve.id = id;
  ve.boundingBox_x1 = left;
  ve.boundingBox_y1 = top;
  ve.boundingBox_x2 = left + width;
  ve.boundingBox_y2 = top + height;
  ve.isBaseShapeType = true;
  ve.shapeType = BASE_SHAPE_TYPE.RECT;
  ve.info = info;
  return ve;
}
