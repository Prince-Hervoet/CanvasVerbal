import { ObjectList } from "../type/ObjectList.js";
import { isInBoundingBox, radiographic } from "../util/common.js";
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
        this.activeObjectId = null;
        // 是否处于拖拽状态
        this.isDraging = false;
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
        this.cleanAll();
        let run = (_a = this.objects.head) === null || _a === void 0 ? void 0 : _a.next;
        while (run) {
            const obj = run.val;
            obj.lastRender(this.secondCtx);
            run = run.next;
        }
    }
    cleanAll() {
        var _a;
        (_a = this.secondCtx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.width, this.height);
    }
}
// 单击事件
CanvasVerbal.singleClick = (event, canvasVerbal) => {
    var _a;
    const mouseLeft = event.clientX;
    const mouseTop = event.clientY;
    let run = (_a = canvasVerbal.objects.head) === null || _a === void 0 ? void 0 : _a.next;
    while (run) { }
};
// 鼠标移动事件
CanvasVerbal.mouseMove = (event, canvasVerbal) => {
    var _a;
    const mouseLeft = event.offsetX;
    const mouseTop = event.offsetY;
    let run = (_a = canvasVerbal.objects.head) === null || _a === void 0 ? void 0 : _a.next;
    while (run) {
        const obj = run.val;
        if (isInBoundingBox(mouseLeft, mouseTop, obj.boundingBoxp1, obj.boundingBoxp2)) {
            if (radiographic(mouseLeft, mouseTop, obj.edges)) {
                console.log("进入了");
                return;
            }
        }
        run = run.next;
    }
};
// 鼠标按下事件
CanvasVerbal.mouseDown = (event, canvasVerbal) => { };
