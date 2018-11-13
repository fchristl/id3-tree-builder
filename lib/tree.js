module.exports = class Tree {
    constructor(value) {
        this.value = value;
        this.children = [];
    }

    add(child) {
        if (child instanceof Tree) {
            this.children.push(child);
            return child;
        } else {
            const newNode = new Tree(child);
            this.children.push(newNode);
            return newNode;
        }

    }
};