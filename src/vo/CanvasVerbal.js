import { Edge } from "./../type/VerbalObject.js";
import { ControlBox } from "./../type/ControlBox.js";
import { Checkbox } from "./../type/Checkbox.js";
import { Point } from "../type/VerbalObject.js";
import { ObjectList } from "../type/ObjectList.js";
import { anyCoordconver, CanvasVerbalStatusType, isInBoundingBox, judgeBoxSelection, radiographic, } from "../util/common.js";
import { PitchOnBox } from "../type/PitchOnBox.js";
const BODY_DOM = document.querySelector("body");
//* 获取创建的canvas主类并将DOM添加到指定的父级元素中
export function canvasVerbal(id, width, height, styleInfo, parent) {
    //? 双层画布的包围元素
    const boundingDiv = document.createElement("div");
    boundingDiv.setAttribute("style", "position: relative;");
    boundingDiv;
    //? 下层画布DOM
    const secondCanvasDom = document.createElement("canvas");
    secondCanvasDom.id = id;
    secondCanvasDom.width = width;
    secondCanvasDom.height = height;
    let styleStr = "";
    for (const s in styleInfo) {
        styleStr = s + ": " + styleInfo[s] + ";";
    }
    secondCanvasDom.setAttribute("style", styleStr);
    //? 上层画布DOM
    const firstCanvasDom = document.createElement("canvas");
    firstCanvasDom.width = width;
    firstCanvasDom.height = height;
    firstCanvasDom.setAttribute("style", "background-color: rgba(255,255,255,0); position: absolute; left:0; top:0;");
    boundingDiv.appendChild(secondCanvasDom);
    boundingDiv.appendChild(firstCanvasDom);
    const cv = new CanvasVerbal(id, firstCanvasDom, secondCanvasDom, boundingDiv);
    parent.appendChild(boundingDiv);
    return cv;
}
// 画布主类，包含canvasDOM、上下文、状态机等
export class CanvasVerbal {
    constructor(id, fitstCanvasDom, secondCanvasDom, boundingDiv) {
        //! 第一层画布 用于处理鼠标事件
        this.firstCanvas = null;
        //! 第二层画布 用于渲染最后的结果
        this.secondCanvas = null;
        // 缓冲
        this.bufferCanvas = null;
        //! 父级元素 包装两层画布的父
        this.boundingDiv = null;
        // 第一层ctx
        this.firstCtx = null;
        // 第二层ctx
        this.secondCtx = null;
        // 元素列表
        this.objects = new ObjectList();
        // 当前选中  的物体
        this.activeObject = null;
        // 鼠标点击拖拽时，鼠标和物体左上角坐标的差值
        this.activeMouseRemainObject = [];
        // 状态
        this.status = 0;
        // 普通按下鼠标按键的起始点
        this.commonMouseDownPoint = [];
        //? 初始化事件绑定（绑定在第一层上）
        this.initEventBinding = (canvasDom) => {
            canvasDom.addEventListener("click", (event) => {
                CanvasVerbal.singleClick(event, this);
            });
            canvasDom.addEventListener("mousemove", (event) => {
                CanvasVerbal.mouseMove(event, this);
            });
            canvasDom.addEventListener("mousedown", (event) => {
                CanvasVerbal.mouseDown(event, this);
            });
            canvasDom.addEventListener("mouseup", (event) => {
                CanvasVerbal.mouseUp(event, this);
            });
        };
        //? 初始化各种dom和画布大小
        this.id = id;
        this.firstCanvas = fitstCanvasDom;
        this.secondCanvas = secondCanvasDom;
        this.firstCtx = fitstCanvasDom.getContext("2d");
        this.secondCtx = secondCanvasDom.getContext("2d");
        this.width = secondCanvasDom.width;
        this.height = secondCanvasDom.height;
        this.boundingDiv = boundingDiv;
        //? 在第一层画布上绑定事件
        this.initEventBinding(this.firstCanvas);
    }
    //? 添加对象方法
    addObject(...args) {
        args.forEach((el) => {
            this.objects.pushBack(el);
        });
        return this;
    }
    //? 将对象列表进行渲染
    render() {
        var _a;
        this.cleanAll(this.secondCtx);
        let run = (_a = this.objects.head) === null || _a === void 0 ? void 0 : _a.next;
        while (run) {
            const obj = run.val;
            obj.lastRender(this.secondCtx);
            run = run.next;
        }
    }
    //? 在第一层渲染事件对象
    eventRender(obj) {
        if (!obj) {
            return;
        }
        this.cleanAll(this.firstCtx);
        obj.lastRender(this.firstCtx);
    }
    //? 清空画布
    cleanAll(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
    }
}
//? 判断鼠标坐标是否在某个对象范围内
CanvasVerbal.judgeMouseInObject = (mouseLeft, mouseTop, canvasVerbal) => {
    //* 从后面往前面遍历，先得到的对象就是响应的层级最高的对象
    let run = canvasVerbal.objects.tail;
    while (run && run !== canvasVerbal.objects.head) {
        const obj = run.val;
        if (isInBoundingBox(mouseLeft, mouseTop, obj.boundingBoxEdges)) {
            if (radiographic(mouseLeft, mouseTop, obj.edges)) {
                return obj;
            }
        }
        run = run.front;
    }
    return null;
};
CanvasVerbal.judgeSelection = (box, canvasVerbal) => {
    let run = canvasVerbal.objects.tail;
    let isOk = false;
    let minLeft = 9999999999;
    let minTop = 9999999999;
    let maxLeft = -1;
    let maxTop = -1;
    while (run && run !== canvasVerbal.objects.head) {
        const obj = run.val;
        if (judgeBoxSelection(box, obj.boundingBoxEdges)) {
            isOk = true;
            minLeft = Math.min(minLeft, obj.boundingBoxp1.left);
            minLeft = Math.min(minLeft, obj.boundingBoxp2.left);
            minLeft = Math.min(minLeft, obj.boundingBoxp3.left);
            minLeft = Math.min(minLeft, obj.boundingBoxp4.left);
            minTop = Math.min(minTop, obj.boundingBoxp1.top);
            minTop = Math.min(minTop, obj.boundingBoxp2.top);
            minTop = Math.min(minTop, obj.boundingBoxp3.top);
            minTop = Math.min(minTop, obj.boundingBoxp4.top);
            maxLeft = Math.max(maxLeft, obj.boundingBoxp1.left);
            maxLeft = Math.max(maxLeft, obj.boundingBoxp2.left);
            maxLeft = Math.max(maxLeft, obj.boundingBoxp3.left);
            maxLeft = Math.max(maxLeft, obj.boundingBoxp4.left);
            maxTop = Math.max(maxTop, obj.boundingBoxp1.top);
            maxTop = Math.max(maxTop, obj.boundingBoxp2.top);
            maxTop = Math.max(maxTop, obj.boundingBoxp3.top);
            maxTop = Math.max(maxTop, obj.boundingBoxp4.top);
        }
        run = run.front;
    }
    if (isOk) {
        return [minLeft, minTop, maxLeft, maxTop];
    }
    return [-1, -1, -1, -1];
};
//? 单击事件
CanvasVerbal.singleClick = (event, canvasVerbal) => { };
//? 鼠标移动事件
CanvasVerbal.mouseMove = (event, canvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const obj = CanvasVerbal.judgeMouseInObject(mouseLeft, mouseTop, canvasVerbal);
    switch (canvasVerbal.status) {
        case CanvasVerbalStatusType.NONE:
            if (obj) {
                // 高亮矩形
                canvasVerbal.cleanAll(canvasVerbal.firstCtx);
                PitchOnBox.render(obj.sumLeft - 1, obj.sumTop - 1, obj.sumLeft + obj.sumWidth + 1, obj.sumTop + obj.sumHeight + 1, obj.rotation, canvasVerbal.firstCtx);
            }
            else {
                canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            }
            break;
        case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
            // 显示复选矩形
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            Checkbox.render(canvasVerbal.commonMouseDownPoint[0], canvasVerbal.commonMouseDownPoint[1], mouseLeft, mouseTop, canvasVerbal.firstCtx);
            break;
        case CanvasVerbalStatusType.PITCH_ON:
            // 拖拽
            if (canvasVerbal.activeObject) {
                canvasVerbal.status = CanvasVerbalStatusType.DRAGING;
                const newLeft = mouseLeft - canvasVerbal.activeMouseRemainObject[0];
                const newTop = mouseTop - canvasVerbal.activeMouseRemainObject[1];
                canvasVerbal.activeObject.changePosition(newLeft, newTop);
                canvasVerbal.eventRender(canvasVerbal.activeObject);
            }
            break;
        case CanvasVerbalStatusType.DRAGING:
            if (canvasVerbal.activeObject) {
                const newLeft = mouseLeft - canvasVerbal.activeMouseRemainObject[0];
                const newTop = mouseTop - canvasVerbal.activeMouseRemainObject[1];
                canvasVerbal.activeObject.changePosition(newLeft, newTop);
                canvasVerbal.eventRender(canvasVerbal.activeObject);
            }
            break;
    }
};
// 鼠标按下事件
CanvasVerbal.mouseDown = (event, canvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const obj = CanvasVerbal.judgeMouseInObject(mouseLeft, mouseTop, canvasVerbal);
    //* 如果在物体上，则为选中状态
    if (obj) {
        canvasVerbal.status = CanvasVerbalStatusType.PITCH_ON;
        canvasVerbal.cleanAll(canvasVerbal.firstCtx);
        obj.isPitchOn = true;
        obj.isShow = false;
        canvasVerbal.activeObject = obj;
        canvasVerbal.render();
        obj.isPitchOn = true;
        obj.isShow = true;
        canvasVerbal.eventRender(obj);
        const remainX = mouseLeft - obj.left;
        const remainY = mouseTop - obj.top;
        canvasVerbal.activeMouseRemainObject[0] = remainX;
        canvasVerbal.activeMouseRemainObject[1] = remainY;
    }
    else {
        canvasVerbal.status = CanvasVerbalStatusType.COMMON_MOUSE_DOWN;
        canvasVerbal.commonMouseDownPoint[0] = mouseLeft;
        canvasVerbal.commonMouseDownPoint[1] = mouseTop;
    }
};
// 鼠标放开事件
CanvasVerbal.mouseUp = (event, canvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    switch (canvasVerbal.status) {
        case CanvasVerbalStatusType.NONE:
            break;
        case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
            canvasVerbal.status = CanvasVerbalStatusType.NONE;
            const [left0, top0, width0, height0] = anyCoordconver(mouseLeft, mouseTop, canvasVerbal.commonMouseDownPoint[0], canvasVerbal.commonMouseDownPoint[1]);
            const p1 = new Point(left0, top0);
            const p2 = new Point(left0 + width0, top0);
            const p3 = new Point(left0 + width0, top0 + height0);
            const p4 = new Point(left0, top0 + height0);
            const e1 = new Edge(p1, p2);
            const e2 = new Edge(p2, p3);
            const e3 = new Edge(p3, p4);
            const e4 = new Edge(p4, p1);
            const edges = [];
            edges.push(e1);
            edges.push(e2);
            edges.push(e3);
            edges.push(e4);
            CanvasVerbal.judgeSelection(edges, canvasVerbal);
            canvasVerbal.commonMouseDownPoint[0] = 0;
            canvasVerbal.commonMouseDownPoint[1] = 0;
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            canvasVerbal.activeObject = null;
            break;
        case CanvasVerbalStatusType.PITCH_ON:
            canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            if (!canvasVerbal.activeObject) {
                break;
            }
            canvasVerbal.activeObject.isShow = true;
            canvasVerbal.activeObject.isPitchOn = true;
            const left1 = canvasVerbal.activeObject.sumLeft;
            const top1 = canvasVerbal.activeObject.sumTop;
            const width1 = canvasVerbal.activeObject.sumWidth;
            const height1 = canvasVerbal.activeObject.sumHeight;
            ControlBox.render(left1, top1, width1, height1, canvasVerbal.activeObject.rotation, canvasVerbal.firstCtx);
            canvasVerbal.render();
            break;
        case CanvasVerbalStatusType.DRAGING:
            canvasVerbal.status = CanvasVerbalStatusType.CONTROL;
            if (!canvasVerbal.activeObject) {
                break;
            }
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            canvasVerbal.activeObject.isShow = true;
            canvasVerbal.render();
            canvasVerbal.activeObject.isShow = true;
            canvasVerbal.activeObject.isPitchOn = true;
            const left2 = canvasVerbal.activeObject.sumLeft;
            const top2 = canvasVerbal.activeObject.sumTop;
            const width2 = canvasVerbal.activeObject.sumWidth;
            const height2 = canvasVerbal.activeObject.sumHeight;
            ControlBox.render(left2, top2, width2, height2, canvasVerbal.activeObject.rotation, canvasVerbal.firstCtx);
            break;
    }
};
