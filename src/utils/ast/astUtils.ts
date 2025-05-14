// types
const isType = (node, type) => node?.type === type;
const isCallExpression = node => isType(node, "CallExpression");
const isObjectExpression = node => isType(node, "ObjectExpression");
const isArrayExpression = node => isType(node, "ArrayExpression");
const isSpreadElement = node => isType(node, "SpreadElement");
const isLiteral = node => isType(node, "Literal");
const isIdentifier = node => isType(node, "Identifier");
const isUnaryExpression = node => isType(node, "UnaryExpression");
const isAwaitExpression = node => isType(node, "AwaitExpression");
const isProperty = node => isType(node, "Property");
const isNull = node => isLiteral(node) && node?.value === null;
const isUndefined = node => isIdentifier(node) && node?.name === "undefined";
const isVoid = node => isUnaryExpression(node) && node?.operator === "void";
const isNullOrUndefinedOrVoid = node => isNull(node) || isUndefined(node) || isVoid(node);

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

/**
 * Checks if a JSX element has any non-whitespace text children
 * @param element The JSX element to check
 * @returns true if the element has any non-whitespace text children
 */
const hasNonEmptyTextChildren = (element) => {
  return element.children.some(child => {
    if (child.type === 'JSXText' && child.value.trim() !== '') {
      return true;
    }
    return false;
  });
};

/**
 * Gets the component name from a JSX element for use in error messages
 * @param element The JSX element to extract the name from
 * @returns The component name, or 'component' if name cannot be determined
 */
const getComponentName = (element) => {
  const openingElement = element.openingElement;
  if (openingElement && openingElement.name) {
    if (openingElement.name.type === 'JSXIdentifier') {
      return openingElement.name.name;
    }
  }
  return 'component';
};

export {
  findByPaths,
  isArrayExpression,
  isAwaitExpression,
  isCalleName,
  isCallExpression,
  isExpect,
  isLiteral,
  isObjectExpression,
  isProperty,
  isSpreadElement,
  isNullOrUndefinedOrVoid,
  hasNonEmptyTextChildren,
  getComponentName,
};
