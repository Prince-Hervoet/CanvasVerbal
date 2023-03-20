import { VerbalObject } from "./VerbalObject";
export class Group extends VerbalObject {
    constructor() {
        super(...arguments);
        // 包含的对象组
        this.objs = [];
        this.remainXs = [];
        this.remainYs = [];
    }
    push(obj) {
        this.objs.push(obj);
        this.remainXs.push(this.left - obj.left);
        this.remainYs.push(this.top - obj.top);
    }
    changePosition(newLeft, newTop) {
        super.changePosition(newLeft, newTop);
        for (let i = 0; i < this.objs.length; i++) {
            const obj = this.objs[i];
            obj.changePosition(newLeft + this.remainXs[i], newTop + this.remainYs[i]);
        }
    }
}
