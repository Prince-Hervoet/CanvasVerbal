//! 控制盒
export class ControlBox {
    static render(left, top, width, height, angle, ctx) {
        ctx.fillStyle = "#BAFBDB";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.stroke();
        ctx.closePath();
    }
}
