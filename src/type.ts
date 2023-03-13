export enum BASE_SHAPE_TYPE {
  RECT = "rect",
  CIRCLE = "circle",
}

export class ElementList {
  #head: Coverage | null;
  #tail: Coverage | null;
  #size: number;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  pushBack(element: VOElement) {
    const co = new Coverage();
    co.el = element;
    co.next = null;
    co.prev = null;
    if (this.#head === null || this.#tail === null) {
      this.#head = co;
      this.#tail = co;
    } else {
      const temp = this.#tail;
      this.#tail.next = co;
      co.prev = temp;
      this.#tail = co;
    }
    this.#size++;
  }

  pushFront() {}

  deleteNode() {}

  getTail() {}

  getHead() {}

  size() {
    return this.#size;
  }
}

class Coverage {
  el: VOElement;
  next: Coverage | null;
  prev: Coverage | null;
}

class Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class VOElement {
  // id
  id: string;
  // name
  name: string;
  // 是否是基础类型
  isBaseShapeType: boolean;
  // 类型名
  shapeType: string;
  // 包围盒左上角x
  boundingBox_x1: number;
  // 包围盒左上角y
  boundingBox_y1: number;
  // 包围盒右下角x
  boundingBox_x2: number;
  // 包围盒右下角y
  boundingBox_y2: number;
  // 其他信息
  info: any;
  // 边信息
  edges: Edge[];

  constructor() {}
}
