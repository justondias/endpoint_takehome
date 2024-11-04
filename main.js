class Tree {
  constructor(value) {
    this.root = { value, children: [] };
  }

  CREATE(path) {
    const pathArray = path.split("/");
    const queue = [this.root];
    let nextPath;

    while (queue.length) {
      const node = queue.shift();
      nextPath = pathArray.shift();

      // if at end of path, insert new node into children array
      if (pathArray.length === 0) {
        const newNode = { value: nextPath, children: [] };
        return node.children.push(newNode);
      }

      for (const child of node.children) {
        // search for matching path
        if (child.value === nextPath) {
          // if not at end, add the matching child to continue down path
          queue.push(child);
        }
      }
    }

    throw new Error(`Cannot create ${path} - ${nextPath} does not exist`);
  }

  DELETE(path) {
    const pathArray = path.split("/");
    const queue = [this.root];
    let nextPath;

    while (queue.length) {
      const node = queue.shift();
      nextPath = pathArray.shift();

      // if at end of path, perform action on child
      if (pathArray.length === 0) {
        const childIndex = node.children.findIndex(
          (child) => child.value === nextPath
        );
        if (childIndex !== -1) {
          return node.children.splice(childIndex, 1)[0];
        }
      }

      for (const child of node.children) {
        // search for matching path
        if (child.value === nextPath) {
          // if not at end, add the matching child to continue down path
          queue.push(child);
        }
      }
    }

    throw new Error(`Cannot delete ${path} - ${nextPath} does not exist`);
  }

  MOVE(sourcePath, destPath) {
    const destPathArray = destPath.split("/");
    let nextPath;

    const queue = [this.root];

    while (queue.length) {
      const node = queue.shift();
      nextPath = destPathArray.shift();

      for (const child of node.children) {
        // search for matching path
        if (child.value === nextPath) {
          // if at end of path and it matches, remove and insert new node into children array
          let nodeToMove;
          if (destPathArray.length === 0) {
            // do nothing on error here so we log appropriate errorn
            try {
              nodeToMove = this.DELETE(sourcePath);
            } catch (e) {}

            if (!nodeToMove) {
              throw new Error(
                `Cannot move ${sourcePath} to ${destPath} - ${sourcePath} does not exist`
              );
            }
            return child.children.push(nodeToMove);
          }
          // if not at end, add the matching child to continue down path
          queue.push(child);
        }
      }
    }

    throw new Error(
      `Cannot move ${sourcePath} to ${destPath} - ${nextPath} does not exist`
    );
  }

  sortChildrenAlpha(arr) {
    return arr.sort((a, b) => a.value.localeCompare(b.value));
  }

  LIST(node = this.root, level = 0) {
    if (level === 0) console.log("LIST");
    const sortedArray = this.sortChildrenAlpha(node.children);
    for (const child of sortedArray) {
      console.log(" ".repeat(level * 2) + child.value);
      this.LIST(child, level + 1);
    }
  }
}

export default function main(commands) {
  const tree = new Tree("/");

  const commandArray = commands.split("\n");

  while (commandArray.length) {
    const currCommand = commandArray.shift().split(" ");
    const [action, ...args] = currCommand;

    try {
      action !== "LIST" && console.log(action, ...args);
      tree[action](...args);
    } catch (e) {
      console.log(e.message);
    }
  }
}

main(`CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
DELETE fruits/apples
DELETE foods/fruits/apples
LIST`);
