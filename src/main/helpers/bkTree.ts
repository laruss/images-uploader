function hammingDistanceBigInt(a: bigint, b: bigint): number {
    let xor = a ^ b;
    let distance = 0;
    while (xor) {
        distance += Number(xor & 1n);
        xor = xor >> 1n;
    }
    return distance;
}

// BK-Tree node storing a hash as BigInt and children indexed by distance
class BKTreeNode {
    hash: bigint;
    children: Map<number, BKTreeNode>;

    constructor(hash: bigint) {
        this.hash = hash;
        this.children = new Map();
    }
}

// BK-Tree for storing hashes and searching for similar hashes
export class BKTree {
    root: BKTreeNode | null = null;

    private toBigInt(hash: string): bigint {
        return BigInt(`0x${hash}`);
    }

    // Add a hash to the tree
    insert(strHash: string): void {
        const hash = this.toBigInt(strHash);

        if (!this.root) {
            this.root = new BKTreeNode(hash);
            return;
        }
        let current = this.root;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const dist = hammingDistanceBigInt(current.hash, hash);
            if (current.children.has(dist)) {
                current = current.children.get(dist)!;
            } else {
                current.children.set(dist, new BKTreeNode(hash));
                break;
            }
        }
    }

    insertMany(hashes: string[]): void {
        hashes.forEach((hash) => this.insert(hash));
    }

    delete(strHash: string): void {
        const hash = this.toBigInt(strHash);

        if (!this.root) {
            return;
        }

        let current = this.root;
        let parent: BKTreeNode | null = null;
        let parentDist = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const dist = hammingDistanceBigInt(current.hash, hash);
            if (dist === 0) {
                if (parent) {
                    parent.children.delete(parentDist);
                } else {
                    this.root = null;
                }
                break;
            }
            if (current.children.has(dist)) {
                parent = current;
                parentDist = dist;
                current = current.children.get(dist)!;
            } else {
                break;
            }
        }
    }

    deleteAll(): void {
        this.root = null;
    }

    // All hashes within a given threshold of the query hash
    // 6 is like a 90% similarity threshold (use 6 or 7 for ~90% similarity)
    search(hashStr: string, threshold: number = 6): bigint[] {
        const result: bigint[] = [];
        const hash = this.toBigInt(hashStr);

        function recursiveSearch(node: BKTreeNode): void {
            const d = hammingDistanceBigInt(node.hash, hash);
            if (d <= threshold) {
                result.push(node.hash);
            }
            // Search subtrees within the threshold distance
            const min = d - threshold;
            const max = d + threshold;
            for (const [childDist, childNode] of node.children) {
                if (childDist >= min && childDist <= max) {
                    recursiveSearch(childNode);
                }
            }
        }

        if (this.root) {
            recursiveSearch(this.root);
        }
        return result;
    }
}
