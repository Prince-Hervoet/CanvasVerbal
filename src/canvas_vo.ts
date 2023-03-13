import { VOElement, ElementList, BASE_SHAPE_TYPE } from "./type";
import { nanoid } from "nanoid";

const CANVAS_MAP = new Map();

function newCanvasVO(name) {
  const canvasDOM = document.createElement("canvas");
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
  fill: string,
  width: number,
  height: number,
  name: string
) {
  const id = nanoid();
  const ve = new VOElement();
  ve.id = id;
  ve.boundingBox_x1 = left;
  ve.boundingBox_y1 = top;
  ve.boundingBox_x2 = left + width;
  ve.boundingBox_y2 = top + height;
  ve.isBaseShapeType = true;
  ve.shapeType = "rect";
  return ve;
}
