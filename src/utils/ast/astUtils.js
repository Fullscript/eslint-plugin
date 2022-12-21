// types
const isType = (node, type) => node?.type === type;
const isCallExpression = node => isType(node, "CallExpression");
const isLiteral = node => isType(node, "Literal");
const isAwaitExpression = node => isType(node, "AwaitExpression");

// calee
const isCalleName = (node, name) => node?.callee?.name === name;
const isExpect = node => isCalleName(node, "expect");

// finder
const findNode = (path, tree) => {
  if (!tree || !path) return null;
  const current = path.shift();
  if (!isType(tree, current)) return null;
  else if (path.length === 0) return tree;
  return findNode(path, tree.parent);
};

const findByPaths = (paths, tree) => {
  for (const path of paths) {
    const found = findNode([...path], tree);
    if (found) return found;
  }
  return null;
};

export { isCallExpression, isLiteral, isAwaitExpression, isCalleName, isExpect, findByPaths };
