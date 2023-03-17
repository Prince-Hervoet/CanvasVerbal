//! 框选矩形
export class Checkbox {
  public static render(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    ctx: CanvasRenderingContext2D
  ) {
    //* 将传入的任意坐标转化为左上角到右下角
    let biggerX = startX >= endX ? startX : endX;
    let biggerY = startY >= endY ? startY : endY;
    let smallerX = startX <= endX ? startX : endX;
    let smallerY = startY <= endY ? startY : endY;
    const remainX = biggerX - smallerX;
    const remainY = biggerY - smallerY;
    const topLeftCornerX = biggerX - remainX;
    const topLeftCornerY = smallerY;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,0.1)";
    ctx.rect(topLeftCornerX, topLeftCornerY, remainX, remainY);
    ctx.fill();
    ctx.closePath();
  }
}
