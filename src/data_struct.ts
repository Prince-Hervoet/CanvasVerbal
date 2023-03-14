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
    co.setData(element);
    co.setNext(null);
    co.setPrev(null);
    if (this.#head === null || this.#tail === null) {
      this.#head = co;
      this.#tail = co;
    } else {
      const temp = this.#tail;
      this.#tail.setNext(co);
      co.setPrev(temp);
      this.#tail = co;
    }
    this.#size++;
    this.#mp.set(co.getData()!.id, co);
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
  #data: VOElement | null;
  #next: Coverage | null;
  #prev: Coverage | null;

  getData() {
    return this.#data;
  }

  getNext() {
    return this.#next;
  }

  getPrev() {
    return this.#prev;
  }

  setData(data: VOElement | null) {
    this.#data = data;
  }

  setNext(next: Coverage | null) {
    this.#next = next;
  }
  setPrev(prev: Coverage | null) {
    this.#prev = prev;
  }
}
