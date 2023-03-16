export class Checkbox {
  public static render(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    ctx: CanvasRenderingContext2D
  ) {
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
