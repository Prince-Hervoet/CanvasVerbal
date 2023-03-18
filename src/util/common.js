const DEGREES_TO_ADGLE = Math.PI / 180;
//* 基础类型名称
export var BaseShapeType;
(function (BaseShapeType) {
    BaseShapeType["RECT"] = "rect";
    BaseShapeType["CIRCLE"] = "circle";
})(BaseShapeType || (BaseShapeType = {}));
//* 设置ctx的基本属性
export const BrushAttributeType = ["fill", "border_color", "border_size"];
//* 画布主类的几种状态
export var CanvasVerbalStatusType;
(function (CanvasVerbalStatusType) {
    CanvasVerbalStatusType[CanvasVerbalStatusType["NONE"] = 0] = "NONE";
    // 选中物体
    CanvasVerbalStatusType[CanvasVerbalStatusType["PITCH_ON"] = 1] = "PITCH_ON";
    // 正在拖拽
    CanvasVerbalStatusType[CanvasVerbalStatusType["DRAGING"] = 2] = "DRAGING";
    // 普通按下
    CanvasVerbalStatusType[CanvasVerbalStatusType["COMMON_MOUSE_DOWN"] = 3] = "COMMON_MOUSE_DOWN";
    // 控制
    CanvasVerbalStatusType[CanvasVerbalStatusType["CONTROL"] = 4] = "CONTROL";
})(CanvasVerbalStatusType || (CanvasVerbalStatusType = {}));
//? 射线检测，检测鼠标是否在一个几何图形内部
export function radiographic(left, top, edges) {
    let count = 0;
    for (const e of edges) {
        const p1 = e.p1;
        const p2 = e.p2;
        // 要上下各一个
        if (p1.top <= top && p2.top >= top) {
            if (p1.left >= left || p2.left >= left) {
                count++;
            }
        }
        else if (p1.top >= top && p2.top <= top) {
            if (p1.left >= left || p2.left >= left) {
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
export function isInBoundingBox(left, top, edges) {
    return radiographic(left, top, edges);
}
//? 将角度转成弧度
export function degreesToAngle(degrees) {
    return degrees * DEGREES_TO_ADGLE;
}
export function anyCoordconver(startX, startY, endX, endY) {
    let biggerX = startX >= endX ? startX : endX;
    let biggerY = startY >= endY ? startY : endY;
    let smallerX = startX <= endX ? startX : endX;
    let smallerY = startY <= endY ? startY : endY;
    const remainX = biggerX - smallerX;
    const remainY = biggerY - smallerY;
    const topLeftCornerX = biggerX - remainX;
    const topLeftCornerY = smallerY;
    return [topLeftCornerX, topLeftCornerY, remainX, remainY];
}
//? 判断盒子相交
export function judgeBoxSelection(boxEdges, targetEdges) {
    for (const be of boxEdges) {
        const p1 = be.p1;
        const p2 = be.p2;
        if (radiographic(p1.left, p1.top, targetEdges) ||
            radiographic(p2.left, p2.top, targetEdges)) {
            return true;
        }
    }
    for (const te of targetEdges) {
        const p1 = te.p1;
        const p2 = te.p2;
        if (radiographic(p1.left, p1.top, boxEdges) ||
            radiographic(p2.left, p2.top, boxEdges)) {
            return true;
        }
    }
    return false;
}
