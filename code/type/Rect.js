import { BaseShapeType } from "../util/common.js";
import { Edge, Point, VerbalObject } from "./VerbalObject.js";
export class Rect extends VerbalObject {
    constructor(args) {
        super();
        this.rx = 0;
        this.ry = 0;
        this.shapeName = BaseShapeType.RECT;
        const that = this;
        for (const a in args) {
            if (a in that) {
                that[a] = args[a];
            }
        }
        this.setEdges();
        this.boundingBoxp1 = new Point(this.left, this.top);
        this.boundingBoxp2 = new Point(this.left + this.width, this.top + this.height);
    }
    setEdges() {
        const x1 = this.left, y1 = this.top;
        const p1 = new Point(x1, y1);
        const x2 = this.left + this.width, y2 = this.top;
        const p2 = new Point(x2, y2);
        const x3 = this.left + this.width, y3 = this.top + this.height;
        const p3 = new Point(x3, y3);
        const x4 = this.left, y4 = this.top + this.height;
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
        ctx.strokeStyle = "#f00"; // 描边样式设置为红色
        ctx.fillStyle = "#00f"; // 填充样式设置为蓝色
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        if (this.isFill) {
            ctx.fill();
        }
        if (this.isStroke) {
            ctx.stroke();
        }
    }
}
