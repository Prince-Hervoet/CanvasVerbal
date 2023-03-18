//! 控制盒
export class ControlBox {
    static render(left, top, width, height, angle, ctx) {
        ctx.fillStyle = "#BAFBDB";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        // ctx.translate(left + width / 2, top + height / 2);
        // ctx.rotate(angle);
        // ctx.beginPath();
        // ctx.arc(left, top, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width / 2, top, 8, 0, 2 * Math.PI);
        // ctx.arc(left + width / 2, top - 25, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width, top, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width, top + height / 2, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width, top + height, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width / 2, top + height, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left + width / 2, top + height, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left, top + height, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.arc(left, top + height / 2, 8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.closePath();
        // ctx.beginPath();
        // ctx.strokeStyle = "#BAFBDB";
        // ctx.moveTo(left + width / 2, top);
        // ctx.lineTo(left + width / 2, top - 25);
        ctx.stroke();
        ctx.closePath();
    }
}
