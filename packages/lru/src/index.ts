/**
 * @jeiizou/LRU
 */

class DLinkedNode {
    next: DLinkedNode | null = null;
    pre: DLinkedNode | null = null;
    constructor(public key: any = null, public val: any = null) {}
}

class DlinkedNodeUtil {
    head: DLinkedNode;
    tail: DLinkedNode;
    constructor() {
        // 初始化双向链表
        this.head = new DLinkedNode();
        this.tail = new DLinkedNode();
        this.head.next = this.tail;
        this.tail.pre = this.head;
    }
    // link opreation
    public addToHead(node: DLinkedNode) {
        node.pre = this.head;
        node.next = this.head.next;
        this.head.next!.pre = node;
        this.head.next = node;
    }

    public removeNode(node: DLinkedNode) {
        if (node.pre) node.pre.next = node.next;
        if (node.next) node.next.pre = node.pre;
    }

    public moveToHead(node: DLinkedNode) {
        this.removeNode(node);
        this.addToHead(node);
    }

    public removeTail() {
        let node = this.tail.pre;
        if (node) this.removeNode(node);
        return node;
    }
}

export default class LRU {
    dlink: DlinkedNodeUtil;
    cache: Map<any, DLinkedNode> = new Map();
    curSize: number = 0;
    constructor(private maxLength: number = 1000) {
        // 初始化双向链表
        this.dlink = new DlinkedNodeUtil();
    }

    // get Value
    public get(key: any) {
        let node = this.cache.get(key);
        if (!node) return null;
        this.dlink.moveToHead(node);
        return node.val;
    }

    // set Value
    public set(key: any, value: any) {
        let node = this.cache.get(key);
        if (!node) {
            // 若node不存在, 则创建一个节点, 保存到哈希表和链表的头部
            node = new DLinkedNode(key, value);
            this.cache.set(key, node);
            this.dlink.addToHead(node);
            // 更新当前节点的数据量
            this.curSize++;

            // 如果数量大于上限, 删除其中一个节点
            if (this.curSize > this.maxLength) {
                this.dlink.removeTail();
                this.cache.delete(key);
                this.curSize--;
            }
        } else {
            // 如果key存在, 先通过map定位, 然后修改value, 并转移到链表的头部
            node.val = value;
            this.dlink.moveToHead(node);
        }
    }
}
