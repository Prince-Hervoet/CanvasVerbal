import { BaseShapeType } from "../util/common.js";
import { Edge, Point, VerbalObject, } from "./VerbalObject.js";
export class Rect extends VerbalObject {
    constructor(baseStyleInfo, styleInfo) {
        super(baseStyleInfo, styleInfo);
        this.rx = 0;
        this.ry = 0;
        this.shapeName = BaseShapeType.RECT;
        this.setEdges();
    }
    setEdges() {
        const x1 = this.sumLeft, y1 = this.sumTop;
        const p1 = new Point(x1, y1);
        const x2 = this.sumLeft + this.sumWidth, y2 = this.sumTop;
        const p2 = new Point(x2, y2);
        const x3 = this.sumLeft + this.sumWidth, y3 = this.sumTop + this.sumHeight;
        const p3 = new Point(x3, y3);
        const x4 = this.sumLeft, y4 = this.sumTop + this.sumHeight;
        const p4 = new Point(x4, y4);
        const e1 = new Edge(p1, p2);
        const e2 = new Edge(p2, p3);
        const e3 = new Edge(p3, p4);
        const e4 = new Edge(p4, p1);
        this.edges = [];
        this.edges.push(e1);
        this.edges.push(e2);
        this.edges.push(e3);
        this.edges.push(e4);
    }
    render(ctx) {
        if (this.width === 0 || this.height === 0 || !this.isShow) {
            return;
        }
        const x1 = this.left, y1 = this.top;
        const x2 = this.left + this.width, y2 = this.top;
        const x3 = this.left + this.width, y3 = this.top + this.height;
        const x4 = this.left, y4 = this.top + this.height;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        if (this.styleInfo.fill) {
            ctx.fill();
        }
        if (this.styleInfo.border_size) {
            ctx.stroke();
        }
    }
}
