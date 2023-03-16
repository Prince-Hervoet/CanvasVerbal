import { BrushAttributeType } from "../util/common.js";
export class Point {
    constructor(left, top) {
        this.left = 0;
        this.top = 0;
        this.left = left;
        this.top = top;
    }
}
export class Edge {
    constructor(p1, p2) {
        this.p1 = null;
        this.p2 = null;
        this.p1 = p1;
        this.p2 = p2;
    }
}
export class VerbalObject {
    constructor() {
        // 位置大小
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
        this.boundingBoxp1 = null;
        this.boundingBoxp2 = null;
        // 边
        this.edges = null;
        // style
        this.styleInfo = {};
        // 放大缩小
        this.scaleX = 0;
        this.scaleY = 0;
        // 旋转角度
        this.rotation = 0;
        // 形状类型
        this.shapeName = "object";
        // id
        this.objectId = "default";
        // 是否被选中
        this.isPitchOn = false;
        // 是否可视
        this.isShow = true;
        // 是否描边
        this.isStroke = true;
        const id = Date.now().toString(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'();
        this.objectId = id;
    }
    render(ctx) { }
    setCtx(ctx) {
        const that = this.styleInfo;
        ctx.strokeStyle = "#f00";
        ctx.fillStyle = "#f00";
        for (const a of BrushAttributeType) {
            if (a in that) {
                switch (a) {
                    case "fill":
                        ctx.fillStyle = that[a];
                        break;
                    case "border-color":
                        ctx.strokeStyle = that[a];
                        break;
                    case "border-size":
                        ctx.lineWidth = that[a];
                        break;
                }
            }
        }
    }
    lastRender(ctx) {
        ctx.save();
        this.setCtx(ctx);
        this.render(ctx);
        ctx.restore();
    }
}
