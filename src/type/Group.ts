import { VerbalObject } from "./VerbalObject";
export class Group extends VerbalObject {
  // 包含的对象组
  objs: VerbalObject[] = [];
  remainXs: number[] = [];
  remainYs: number[] = [];

  public push(obj: VerbalObject) {
    this.objs.push(obj);
    this.remainXs.push(this.left - obj.left);
    this.remainYs.push(this.top - obj.top);
  }

  public changePosition(newLeft: number, newTop: number): void {
    super.changePosition(newLeft, newTop);
    for (let i = 0; i < this.objs.length; i++) {
      const obj = this.objs[i];
      obj.changePosition(newLeft + this.remainXs[i], newTop + this.remainYs[i]);
    }
  }
}
