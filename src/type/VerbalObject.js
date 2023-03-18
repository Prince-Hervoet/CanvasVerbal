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
        //* 内容位置
        this.left = 0;
        this.top = 0;
        //* 内容大小
        this.width = 0;
        this.height = 0;
        //* 加上描边的总大小
        this.sumLeft = 0;
        this.sumTop = 0;
        this.sumWidth = 0;
        this.sumHeight = 0;
        //* 包围盒位置
        this.boundingBoxp1 = null;
        this.boundingBoxp2 = null;
        this.boundingBoxp3 = null;
        this.boundingBoxp4 = null;
        // 边
        this.edges = null;
        // style
        this.styleInfo = { fill: "", border_size: 0, border_color: "" };
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
        //* 计算包围盒大小
        this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
        this.boundingBoxp2 = new Point(this.sumLeft + this.sumWidth, this.sumTop + this.sumHeight);
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
    //? 改变位置的重新计算函数
    changePosition(newLeft, newTop) {
        this.left = newLeft;
        this.top = newTop;
        this.calculatePosition(this.styleInfo);
        this.boundingBoxp1 = new Point(this.sumLeft, this.sumTop);
        this.boundingBoxp2 = new Point(this.sumLeft + this.sumWidth, this.sumTop + this.sumHeight);
        this.setEdges();
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
}
