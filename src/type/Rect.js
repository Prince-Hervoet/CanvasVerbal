import { BaseShapeType } from "../util/common";
import { VerbalObject } from "./VerbalObject";
class Rect extends VerbalObject {
    constructor(args) {
        super();
        this.rx = 0;
        this.ry = 0;
        this.shapeName = BaseShapeType.RECT;
    }
    render(ctx) { }
}
