//! 节点
export class ListNode {
    constructor() {
        this.val = null;
        this.next = null;
        this.front = null;
    }
}
//! 对象链表类
export class ObjectList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.head = new ListNode();
        this.tail = this.head;
    }
    pushBack(object) {
        if (!object) {
            return;
        }
        const node = new ListNode();
        node.val = object;
        this.tail.next = node;
        node.front = this.tail;
        this.tail = node;
        this.size += 1;
    }
    deleteNode(node) {
        if (!node || node === this.head) {
            return;
        }
        const next = node.next;
        const front = node.front;
        front.next = next;
        node.front = null;
        node.next = null;
        if (next) {
            next.front = front;
        }
        if (node === this.tail) {
            this.tail = front;
        }
        this.size -= 1;
    }
}
