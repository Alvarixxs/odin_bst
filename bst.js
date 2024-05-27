function merge(left, right) {
    let sortedArr = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            sortedArr.push(left.shift());
        } else {
            sortedArr.push(right.shift());
        }
    }
    return [...sortedArr, ...left, ...right];
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = mergeSort(arr.slice(0, mid));
    let right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

const create_node = function (data) {
    let left = null;
    let right = null;
    return { data, left, right };
}

const create_bst = function (arr) {
    let root = null;

    const buildTree = function (array) {
        let uniqueArray = [...new Set(array)];
        let sortedArr = mergeSort(uniqueArray);
        root = sortedArrayToBST(sortedArr, 0, sortedArr.length - 1);
    }

    const sortedArrayToBST = function (arr, start, end) {
        if (start > end) {
            return null;
        }
        let mid = Math.floor((start + end) / 2);
        let node = create_node(arr[mid]);
        node.left = sortedArrayToBST(arr, start, mid - 1);
        node.right = sortedArrayToBST(arr, mid + 1, end);
        return node;
    }

    buildTree(arr);

    const insert = function (value) {
        root = insertRec(root, value);
    }

    const insertRec = function (root, value) {
        if (root === null) {
            return create_node(value);
        }
        if (value < root.data) {
            root.left = insertRec(root.left, value);
        } else if (value > root.data) {
            root.right = insertRec(root.right, value);
        }
        return root;
    }

    const deleteItem = function (value) {
        root = deleteItemRec(root, value);
    }

    const deleteItemRec = function (root, value) {
        if (root === null) {
            return null;
        }
        if (value < root.data) {
            root.left = deleteItemRec(root.left, value);
            return root;
        } else if (value > root.data) {
            root.right = deleteItemRec(root.right, value);
            return root;
        }
        if (root.left === null && root.right === null) {
            return null;
        } else if (root.left === null) {
            return root.right;
        } else if (root.right === null) {
            return root.left;
        } else {
            let aux = root.right;
            while (aux.left != null) {
                aux = aux.left;
            }
            root.right = deleteItemRec(root.right, aux.data);
            root.data = aux.data;
            return root;
        }
    }

    const find = function (value) {
        return findRec(root, value);
    }

    const findRec = function (root, value) {
        if (root === null) {
            return null;
        }
        if (value < root.data) {
            return findRec(root.left, value);
        } else if (value > root.data) {
            return findRec(root.right, value);
        }
        return root;
    }

    const levelOrder = function (callback = (ev) => ev.data) {
        const ret = [];
        let queue = [];
        queue.push(root);
        while (queue.length !== 0) {
            let current = queue.shift();
            ret.push(callback(current));
            if (current.left !== null) queue.push(current.left);
            if (current.right !== null) queue.push(current.right);
        }
        return ret;
    }

    const inOrder = function (callback = (ev) => ev.data) {
        let ret = [];
        inOrderRec(root, callback, ret);
        return ret;
    }

    const inOrderRec = function (root, callback, ret) {
        if (root === null) return;
        inOrderRec(root.left, callback, ret);
        ret.push(callback(root));
        inOrderRec(root.right, callback, ret);
    }

    const preOrder = function (callback = (ev) => ev.data) {
        let ret = [];
        preOrderRec(root, callback, ret);
        return ret;
    }

    const preOrderRec = function (root, callback, ret) {
        if (root === null) return;
        ret.push(callback(root));
        preOrderRec(root.left, callback, ret);
        preOrderRec(root.right, callback, ret);
    }

    const postOrder = function (callback = (ev) => ev.data) {
        let ret = [];
        postOrderRec(root, callback, ret);
        return ret;
    }

    const postOrderRec = function (root, callback, ret) {
        if (root === null) return;
        postOrderRec(root.left, callback, ret);
        postOrderRec(root.right, callback, ret);
        ret.push(callback(root));
    }

    const height = function (node) {
        if (node === null) return 0;
        return Math.max(height(node.left), height(node.right)) + 1;
    }

    const depth = function (node) {
        return depthRec(root, node);
    }

    const depthRec = function (root, node) {
        if (root === null) return -1;
        if (root === node) return 0;
        let max = Math.max(depthRec(root.left, node), depthRec(root.right, node));
        if (max === -1) return -1;
        return max + 1;
    }

    const isBalanced = function () {
        return isBalancedRec(root) !== -1;
    }

    const isBalancedRec = function (root) {
        if (root === null) return 0;
        let leftHeight = isBalancedRec(root.left);
        let rightHeight = isBalancedRec(root.right);
        if (leftHeight === -1 || rightHeight === -1) return -1;
        if (Math.abs(leftHeight - rightHeight) > 1) return -1;
        return Math.max(leftHeight, rightHeight) + 1;
    }

    const rebalance = function () {
        let res = inOrder();
        root = sortedArrayToBST(res, 0, res.length - 1);
    }

    return {
        get root() { return root; },
        insert,
        deleteItem,
        find,
        levelOrder,
        inOrder,
        preOrder,
        postOrder,
        height,
        depth,
        isBalanced,
        rebalance
    };
}

const random_list = function (size) {
    let ret = new Array(size).fill(null);
    let prime = (size - 1) * 5;
    for (let i = 0; i < size; i++) {
        let aux = (i * prime) % size;
        while (ret[aux] !== null) {
            aux = (aux + 1) % size;
        }
        ret[aux] = i;
    }
    return ret;
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
}

let arr = random_list(70);
let bst = create_bst(arr);
prettyPrint(bst.root);
console.log(bst.isBalanced());
console.log(bst.preOrder());
console.log(bst.postOrder());
console.log(bst.inOrder());

let ran = random_list(100);
for (let i = 0; i < ran.length; i++) {
    bst.insert(ran[i]);
}
prettyPrint(bst.root);
console.log(bst.isBalanced());
bst.rebalance();
prettyPrint(bst.root);
console.log(bst.isBalanced());
