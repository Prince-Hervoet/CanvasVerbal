import { ObjectList } from "../type/ObjectList.js";
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
    firstCanvasDom.setAttribute("style", "background-color: blue; position: absolute; left:0; top:0;");
    boundingDiv.appendChild(secondCanvasDom);
    boundingDiv.appendChild(firstCanvasDom);
    const cv = new CanvasVerbal(id, firstCanvasDom, secondCanvasDom, boundingDiv);
    parent.appendChild(boundingDiv);
    return cv;
}
class CanvasVerbal {
    constructor(id, fitstCanvasDom, secondCanvasDom, boundingDiv) {
        // 第一层画布
        this.firstCanvas = null;
        // 第二层画布
        this.secondCanvas = null;
        // 缓冲
        this.bufferCanvas = null;
        // 父级元素
        this.boundingDiv = null;
        this.firstCtx = null;
        this.secondCtx = null;
        // 元素列表
        this.objects = new ObjectList();
        this.id = id;
        this.firstCanvas = fitstCanvasDom;
        this.secondCanvas = secondCanvasDom;
        this.firstCtx = fitstCanvasDom.getContext("2d");
        this.secondCtx = secondCanvasDom.getContext("2d");
        this.width = secondCanvasDom.width;
        this.height = secondCanvasDom.height;
        this.boundingDiv = boundingDiv;
    }
    addObject(...args) {
        args.forEach((el) => {
            this.objects.pushBack(el);
        });
    }
    render() {
        this.cleanAll();
        let run = this.objects.head.next;
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
