import { BrushAttributeType } from "../util/common.js";
//! 点
export class Point {
    constructor(left, top) {
        this.left = 0;
        this.top = 0;
        this.left = left;
        this.top = top;
    }
}
//! 边
export class Edge {
    constructor(p1, p2) {
        this.p1 = null;
        this.p2 = null;
        this.p1 = p1;
        this.p2 = p2;
    }
}
//! 附加风格
export class StyleInfo {
    constructor() {
        this.fill = "";
        this.border_size = 0;
        this.border_color = "";
    }
}
//! 对象基类
export class VerbalObject {
    constructor(baseStyleInfo, styleInfo) {
        //* 内容位置（不包含描边）
        this.left = 0;
        this.top = 0;
        //* 内容大小（不包含描边）
        this.width = 0;
        this.height = 0;
        //* 加上描边的总大小
        this.sumLeft = 0;
        this.sumTop = 0;
        this.sumWidth = 0;
        this.sumHeight = 0;
        //* 包围盒的四个点
        this.boundingBoxp1 = new Point(0, 0);
        this.boundingBoxp2 = new Point(0, 0);
        this.boundingBoxp3 = new Point(0, 0);
        this.boundingBoxp4 = new Point(0, 0);
        //* 内容的边
        this.edges = [];
        //* 包围盒的边
        this.boundingBoxEdges = [];
        //* 附加风格
        this.styleInfo = { fill: "", border_size: 0, border_color: "" };
        //* 放大缩小系数
        this.scaleX = 0;
        this.scaleY = 0;
        //* 旋转角度（不会影响内容的位置和边，因为只考虑包围盒即可）
        this.rotation = 0;
        //* 形状类型
        this.shapeName = "object";
        // id
        this.objectId = "default";
        // 是否可视
        this.isShow = true;
        //* 生成一个id
        const id = "object_" + Date.now().toString();
        this.objectId = id;
        //* 基础属性赋值
        const that = this;
        const baseT = baseStyleInfo;
        for (const base in baseStyleInfo) {
            if (base in this) {
                that[base] = baseT[base];
            }
        }
        //* 附加属性赋值
        this.styleInfo = styleInfo;
        //* 计算加上描边的总大小
        this.calculatePosition(styleInfo);
        //* 设置包围盒
        this.setBoundingBox();
    }
    render(ctx) { }
    setEdges() { }
    //? 设置ctx的颜色等
    setCtx(ctx) {
        const that = this.styleInfo;
        ctx.strokeStyle = "#f00";
        ctx.fillStyle = "#f00";
        for (const a of BrushAttributeType) {
            if (a in that) {
                switch (a) {
                    case "fill":
                        if (that[a]) {
                            ctx.fillStyle = that[a];
                        }
                        break;
                    case "border_color":
                        if (that[a]) {
                            ctx.strokeStyle = that[a];
                        }
                        break;
                    case "border_size":
                        if (that[a]) {
                            ctx.lineWidth = that[a];
                        }
                        break;
                }
            }
        }
    }
    setBoundingBox() {
        //* 计算包围盒大小
        this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
        this.boundingBoxp2 = new Point(this.sumLeft + this.sumWidth, this.sumTop);
        this.boundingBoxp3 = new Point(this.sumLeft + this.sumWidth, this.sumTop + this.sumHeight);
        this.boundingBoxp4 = new Point(this.sumLeft, this.sumTop + this.sumHeight);
        const e1 = new Edge(this.boundingBoxp1, this.boundingBoxp2);
        const e2 = new Edge(this.boundingBoxp2, this.boundingBoxp3);
        const e3 = new Edge(this.boundingBoxp3, this.boundingBoxp4);
        const e4 = new Edge(this.boundingBoxp4, this.boundingBoxp1);
        this.boundingBoxEdges = [];
        this.boundingBoxEdges.push(e1);
        this.boundingBoxEdges.push(e2);
        this.boundingBoxEdges.push(e3);
        this.boundingBoxEdges.push(e4);
    }
    //? 改变位置的重新计算函数
    changePosition(newLeft, newTop) {
        this.left = newLeft;
        this.top = newTop;
        this.calculatePosition(this.styleInfo);
        this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
        this.boundingBoxp2 = new Point(this.sumLeft + this.sumWidth, this.sumTop + this.sumHeight);
        this.setEdges();
        this.setBoundingBox();
    }
    //? 计算描边
    calculatePosition(styleInfo) {
        const key = "border_size";
        if (key in styleInfo) {
            this.sumWidth = this.width + styleInfo[key];
            this.sumHeight = this.height + styleInfo[key];
            this.sumLeft = this.left - styleInfo[key] / 2;
            this.sumTop = this.top - styleInfo[key] / 2;
        }
    }
    lastRender(ctx) {
        ctx.save();
        this.setCtx(ctx);
        this.render(ctx);
        ctx.restore();
    }
    copyMe() {
        const newObj = new VerbalObject({
            width: this.width,
            height: this.height,
            left: this.left,
            top: this.top,
        }, this.styleInfo);
        return newObj;
    }
}
