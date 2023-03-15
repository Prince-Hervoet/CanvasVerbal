import { ObjectList } from "../type/ObjectList";
export function canvasVerbal(id, width, height, styleInfo, parent) {
    const dom = document.getElementById(id) ||
        document.createElement("canvas");
    dom.id = id;
    dom.width = width;
    dom.height = height;
    for (const s in styleInfo) {
        dom.setAttribute(s, styleInfo[s]);
    }
    parent.appendChild(dom);
    const cv = new CanvasVerbal(id, dom);
    return cv;
}
class CanvasVerbal {
    constructor(id, canvasDom) {
        // 第一层画布
        this.firstCanvas = null;
        // 第二层画布
        this.secondCanvas = null;
        // 缓冲
        this.bufferCanvas = null;
        // 父级元素
        this.parentElement = null;
        this.firstCtx = null;
        this.secondCtx = null;
        // 元素列表
        this.objects = new ObjectList();
        this.id = id;
        this.firstCanvas = canvasDom;
        this.secondCanvas = canvasDom;
        this.firstCtx = canvasDom.getContext("2d");
        this.secondCtx = canvasDom.getContext("2d");
        this.width = canvasDom.width;
        this.height = canvasDom.height;
    }
    addObject(...args) {
        args.forEach((el) => {
            this.objects.pushBack(el);
        });
    }
    render() {
        this.cleanAll();
        let run = this.objects.head;
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
