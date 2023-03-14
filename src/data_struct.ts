import { VOElement } from "./type";

// 元素链表结构
export class ElementList {
  #head: Coverage | null;
  #tail: Coverage | null;
  #size: number;
  #mp: Map<string, Coverage>;

  constructor() {
    this.#head = new Coverage();
    this.#tail = this.#head;
    this.#size = 0;
    this.#mp = new Map();
  }

  pushBack(element: VOElement) {
    const co = new Coverage();
    co.data = element;
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
    this.#mp.set(co.data.id, co);
  }

  pushFront() {}

  deleteNode(id: string) {}

  getTail() {
    return this.#tail;
  }

  getHead() {
    return this.#head;
  }

  size() {
    return this.#size;
  }
}

class Coverage {
  data: VOElement | null;
  next: Coverage | null;
  prev: Coverage | null;
}
