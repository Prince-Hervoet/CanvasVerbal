import { nanoid } from "../../node_modules/nanoid/index";
class Point {
    constructor() {
        this.left = 0;
        this.top = 0;
    }
}
class Edge {
    constructor() {
        this.p1 = null;
        this.p2 = null;
    }
}
export class VerbalObject {
    constructor() {
        // 包围盒位置大小
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
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
        // 是否填充
        this.isFill = false;
        // 是否描边
        this.isStroke = true;
        const id = nanoid();
        this.objectId = id;
    }
    render(ctx) { }
    lastRender(ctx) {
        ctx.save();
        this.render(ctx);
        ctx.restore();
    }
}
