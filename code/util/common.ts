import { Edge, Point } from "./../type/VerbalObject";
export enum BaseShapeType {
  RECT = "rect",
  CIRCLE = "circle",
}

export const BrushAttributeType = ["fill", "border", "border-size"];

// 射线检测
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

// 判断是否在包围盒内
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
