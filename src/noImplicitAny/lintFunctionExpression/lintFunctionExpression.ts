import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { ImplicitAnyContext } from "../type";
import { lintFunctionArgument } from "../lintFunctionUtils";

const hasObjectTypeAnnotationInAncestors = (node: TSESTree.Node) => {
  if (node.parent === null) {
    return false;
  } else if (node.parent.type === AST_NODE_TYPES.VariableDeclarator) {
    return node.parent.id.typeAnnotation ? true : false;
  }

  return hasObjectTypeAnnotationInAncestors(node.parent);
};

export const lintFunctionExpression = (
  context: ImplicitAnyContext,
  node: TSESTree.FunctionExpression
) => {
  let nodeToLint = node;

  // For react component props
  if (node.parent.type === AST_NODE_TYPES.JSXExpressionContainer) return;
  if (node.parent.type === AST_NODE_TYPES.CallExpression) {
    const parserServices = ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(node.parent.callee);

    if (type.symbol && type.symbol.valueDeclaration) {
      nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
      if (!nodeToLint) return;
    } else if (node.parent.callee.type === AST_NODE_TYPES.Identifier) {
      return;
    }
  }
  if (node.parent.type === AST_NODE_TYPES.Property) {
    const hasObjectAnnotation = hasObjectTypeAnnotationInAncestors(node.parent.parent);
    if (hasObjectAnnotation) {
      return;
    } else if (node.parent.parent.parent.type === AST_NODE_TYPES.CallExpression) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(node.parent.parent.parent.callee);
      if (type.symbol && type.symbol.valueDeclaration) {
        nodeToLint = parserServices.tsNodeToESTreeNodeMap.get(type.symbol.valueDeclaration);
        if (!nodeToLint) return;
      }
    }
  }

  nodeToLint.params.forEach(arg => {
    lintFunctionArgument(context, arg);
  });
};
