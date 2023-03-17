//! 选中状态高亮矩形
export class PitchOnBox {
    static render(startX, startY, endX, endY, ctx) {
        let biggerX = startX >= endX ? startX : endX;
        let biggerY = startY >= endY ? startY : endY;
        let smallerX = startX <= endX ? startX : endX;
        let smallerY = startY <= endY ? startY : endY;
        const remainX = biggerX - smallerX;
        const remainY = biggerY - smallerY;
        const topLeftCornerX = biggerX - remainX;
        const topLeftCornerY = smallerY;
        ctx.beginPath();
        ctx.fillStyle = "rgb(255,255,255,0.4)";
        ctx.rect(topLeftCornerX, topLeftCornerY, remainX, remainY);
        ctx.fill();
        ctx.closePath();
    }
}
