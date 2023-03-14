import { nanoid } from "nanoid";
import { VOElement } from "./type";

// 基础类型名称
export enum BASE_SHAPE_TYPE {
  RECT = "rect",
  CIRCLE = "circle",
  LINE = "line",
}

export function getRect(
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
