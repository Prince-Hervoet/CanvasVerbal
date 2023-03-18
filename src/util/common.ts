import { Edge, Point } from "./../type/VerbalObject";

const DEGREES_TO_ADGLE = Math.PI / 180;

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
  // 控制
  CONTROL = 4,
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

//? 将角度转成弧度
export function degreesToAngle(degrees: number) {
  return degrees * DEGREES_TO_ADGLE;
}

export function judgeBoxSelection(boxEdges: Edge[], targetEdges: Edge[]) {
  let inCount = 0;
  let minTop = 999999999,
    minLeft = 999999999;
  let maxTop = 0,
    maxLeft = 0;
  for (const be of boxEdges) {
    const p1 = be.p1!;
    const p2 = be.p2!;
    minTop = minTop < p1.top ? minTop : p1.top;
    maxTop = maxTop > p1.top ? maxTop : p1.top;
    minLeft = minLeft < p1.left ? minLeft : p1.left;
    maxLeft = maxLeft > p1.left ? maxLeft : p1.left;
    for (const te of targetEdges) {
      const p11 = te.p1!;
      const p22 = te.p2!;
      if (p1.top === p2.top) {
        if (p11.top < p1.top && p22.top < p1.top) {
          continue;
        } else if (p11.top > p1.top && p22.top > p1.top) {
          continue;
        } else {
          return true;
        }
      } else if (p1.left === p2.left) {
        if (p11.left < p1.left && p22.left < p1.left) {
          continue;
        } else if (p11.left > p1.left && p22.left > p1.left) {
          continue;
        } else {
          return true;
        }
      }
    }
  }
  return false;
}
