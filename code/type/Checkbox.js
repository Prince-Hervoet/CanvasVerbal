export class Checkbox {
    static render(startX, startY, endX, endY, ctx) {
        let biggerX = startX >= endX ? startX : endX;
        let biggerY = startY >= endY ? startY : endY;
        let smallerX = startX <= endX ? startX : endX;
        let smallerY = startY <= endY ? startY : endY;
        const remainX = biggerX - smallerX;
        const remainY = biggerY - smallerY;
        const topLeftCornerX = biggerX - remainX;
        const topLeftCornerY = smallerY;
        ctx.save();
        ctx.fillStyle = "rgba(255,0,0,0.5)";
        ctx.rect(topLeftCornerX, topLeftCornerY, remainX, remainY);
        ctx.restore();
    }
}
