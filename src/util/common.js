export var BaseShapeType;
(function (BaseShapeType) {
    BaseShapeType["RECT"] = "rect";
    BaseShapeType["CIRCLE"] = "circle";
})(BaseShapeType || (BaseShapeType = {}));
export const BrushAttributeType = ["fill", "border_color", "border_size"];
export var CanvasVerbalStatusType;
(function (CanvasVerbalStatusType) {
    CanvasVerbalStatusType[CanvasVerbalStatusType["NONE"] = 0] = "NONE";
    // 选中物体
    CanvasVerbalStatusType[CanvasVerbalStatusType["PITCH_ON"] = 1] = "PITCH_ON";
    // 正在拖拽
    CanvasVerbalStatusType[CanvasVerbalStatusType["DRAGING"] = 2] = "DRAGING";
    // 普通按下
    CanvasVerbalStatusType[CanvasVerbalStatusType["COMMON_MOUSE_DOWN"] = 3] = "COMMON_MOUSE_DOWN";
})(CanvasVerbalStatusType || (CanvasVerbalStatusType = {}));
// 射线检测
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
// 判断是否在包围盒内
export function isInBoundingBox(left, top, p1, p2) {
    if (left > p1.left && left > p2.left) {
        return false;
    }
    else if (top > p1.top && top > p2.top) {
        return false;
    }
    else if (left < p1.left && left < p2.left) {
        return false;
    }
    else if (top < p1.top && top < p2.top) {
        return false;
    }
    return true;
}
