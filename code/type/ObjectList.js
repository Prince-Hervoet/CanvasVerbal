class ListNode {
    constructor() {
        this.val = null;
        this.next = null;
        this.front = null;
    }
}
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
        this.tail = this.tail.next;
        this.size += 1;
    }
}
