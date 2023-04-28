//! 控制盒
export class ControlBox {
  public static render(
    left: number,
    top: number,
    width: number,
    height: number,
    angle: number,
    ctx: CanvasRenderingContext2D
  ) {
    ctx.fillStyle = "#BAFBDB";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.stroke();
    ctx.closePath();
  }
}
