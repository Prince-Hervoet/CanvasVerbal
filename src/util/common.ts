import { Edge, Point } from "./../type/VerbalObject";

//* 基础类型名称
export enum BaseShapeType {
  RECT = "rect",
  CIRCLE = "circle",
}

//* 设置ctx的基本属性
export const BrushAttributeType = ["fill", "border_color", "border_size"];

//* 画布主类的几种状态
export enum CanvasVerbalStatusType {
  NONE = 0,
  // 选中物体
  PITCH_ON = 1,
  // 正在拖拽
  DRAGING = 2,
  // 普通按下
  COMMON_MOUSE_DOWN = 3,
}

//? 射线检测，检测鼠标是否在一个几何图形内部
export function radiographic(left: number, top: number, edges: Edge[]) {
  let count = 0;
  for (const e of edges) {
    const p1 = e.p1;
    const p2 = e.p2;

    // 要上下各一个
    if (p1!.top <= top && p2!.top >= top) {
      if (p1!.left >= left || p2!.left >= left) {
        count++;
      }
    } else if (p1!.top >= top && p2!.top <= top) {
      if (p1!.left >= left || p2!.left >= left) {
        count++;
      }
    }
  }
  if ((count & 1) == 1) {
    return true;
  }
  return false;
}

//? 判断是否在包围盒内
export function isInBoundingBox(
  left: number,
  top: number,
  p1: Point,
  p2: Point
) {
  if (left > p1.left && left > p2.left) {
    return false;
  } else if (top > p1.top && top > p2.top) {
    return false;
  } else if (left < p1.left && left < p2.left) {
    return false;
  } else if (top < p1.top && top < p2.top) {
    return false;
  }
  return true;
}

export function isCloseToEdges(aEdges: Edge[], bEdges: Edge[]) {}
