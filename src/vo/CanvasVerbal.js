import { Checkbox } from "./../type/Checkbox.js";
import { ObjectList } from "../type/ObjectList.js";
import { CanvasVerbalStatusType, isInBoundingBox, radiographic, } from "../util/common.js";
import { PitchOnBox } from "../type/PitchOnBox.js";
const BODY_DOM = document.querySelector("body");
export function canvasVerbal(id, width, height, styleInfo, parent) {
    // 双层画布的包围元素
    const boundingDiv = document.createElement("div");
    boundingDiv.setAttribute("style", "position: relative;");
    boundingDiv;
    // 下层画布DOM
    const secondCanvasDom = document.createElement("canvas");
    secondCanvasDom.id = id;
    secondCanvasDom.width = width;
    secondCanvasDom.height = height;
    let styleStr = "";
    for (const s in styleInfo) {
        styleStr = s + ": " + styleInfo[s] + ";";
    }
    secondCanvasDom.setAttribute("style", styleStr);
    // 上层画布DOM
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
export class CanvasVerbal {
    constructor(id, fitstCanvasDom, secondCanvasDom, boundingDiv) {
        // 第一层画布
        this.firstCanvas = null;
        // 第二层画布
        this.secondCanvas = null;
        // 缓冲
        this.bufferCanvas = null;
        // 父级元素
        this.boundingDiv = null;
        // 第一层ctx
        this.firstCtx = null;
        // 第二层ctx
        this.secondCtx = null;
        // 元素列表
        this.objects = new ObjectList();
        // 当前选中的物体
        this.activeObject = null;
        // 鼠标点击拖拽时，鼠标和物体左上角坐标的差值
        this.activeMouseRemainObject = [];
        // 状态
        this.status = 0;
        this.commonMouseDownPoint = [];
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
        this.id = id;
        this.firstCanvas = fitstCanvasDom;
        this.secondCanvas = secondCanvasDom;
        this.firstCtx = fitstCanvasDom.getContext("2d");
        this.secondCtx = secondCanvasDom.getContext("2d");
        this.width = secondCanvasDom.width;
        this.height = secondCanvasDom.height;
        this.boundingDiv = boundingDiv;
        this.initEventBinding(this.firstCanvas);
    }
    addObject(...args) {
        args.forEach((el) => {
            this.objects.pushBack(el);
        });
    }
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
    eventRender(obj) {
        if (!obj) {
            return;
        }
        this.cleanAll(this.firstCtx);
        obj.lastRender(this.firstCtx);
    }
    cleanAll(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);
    }
}
CanvasVerbal.judgeMouseInObject = (mouseLeft, mouseTop, canvasVerbal) => {
    let run = canvasVerbal.objects.tail;
    while (run && run !== canvasVerbal.objects.head) {
        const obj = run.val;
        if (isInBoundingBox(mouseLeft, mouseTop, obj.boundingBoxp1, obj.boundingBoxp2)) {
            if (radiographic(mouseLeft, mouseTop, obj.edges)) {
                return obj;
            }
        }
        run = run.front;
    }
    return null;
};
// 单击事件
CanvasVerbal.singleClick = (event, canvasVerbal) => {
    const mouseLeft = event.clientX;
    const mouseTop = event.clientY;
};
// 鼠标移动事件
CanvasVerbal.mouseMove = (event, canvasVerbal) => {
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    const obj = CanvasVerbal.judgeMouseInObject(mouseLeft, mouseTop, canvasVerbal);
    switch (canvasVerbal.status) {
        case CanvasVerbalStatusType.NONE:
            if (obj) {
                // 高亮矩形
                canvasVerbal.cleanAll(canvasVerbal.firstCtx);
                PitchOnBox.render(obj.sumLeft - 1, obj.sumTop - 1, obj.sumLeft + obj.sumWidth + 1, obj.sumTop + obj.sumHeight + 1, canvasVerbal.firstCtx);
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
    switch (canvasVerbal.status) {
        case CanvasVerbalStatusType.NONE:
            break;
        case CanvasVerbalStatusType.COMMON_MOUSE_DOWN:
            canvasVerbal.status = CanvasVerbalStatusType.NONE;
            canvasVerbal.commonMouseDownPoint[0] = 0;
            canvasVerbal.commonMouseDownPoint[1] = 0;
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            break;
        case CanvasVerbalStatusType.PITCH_ON:
            canvasVerbal.status = CanvasVerbalStatusType.NONE;
            canvasVerbal.cleanAll(canvasVerbal.firstCtx);
            if (canvasVerbal.activeObject) {
                canvasVerbal.activeObject.isShow = true;
                canvasVerbal.activeObject.isPitchOn = false;
                canvasVerbal.activeObject = null;
                console.log("asdfasdf");
            }
            canvasVerbal.render();
            break;
    }
};
