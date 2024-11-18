import { ESLintUtils, type ParserServicesWithTypeInformation } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";

import * as ts from "typescript";

// Check if a given node has a type annotation in ancestors by traversing up AST.
function hasTypeAnnotationInAncestorNode(
  parserServices: ParserServicesWithTypeInformation,
  node: TSESTree.MemberExpression
) {
  if (node.object.type === AST_NODE_TYPES.TSAsExpression) {
    return true;
  } else if (node.object.type === AST_NODE_TYPES.Identifier) {
    const symbol = parserServices.getSymbolAtLocation(node.object);
    if (symbol && symbol.valueDeclaration) {
      const declaration = parserServices.tsNodeToESTreeNodeMap.get(symbol.valueDeclaration);
      if (declaration.type === AST_NODE_TYPES.VariableDeclarator) {
        return (
          !!declaration.id.typeAnnotation || declaration.init.type === AST_NODE_TYPES.TSAsExpression
        );
      } else {
        return false;
      }
    }

    return false;
  } else if (node.object.type === AST_NODE_TYPES.MemberExpression) {
    // Check parent node recursively
    return hasTypeAnnotationInAncestorNode(parserServices, node.object);
  } else {
    return false;
  }
}

export const lintMemberExpression = (
  context: ImplicitAnyContext,
  node: TSESTree.MemberExpression
) => {
  const parserServices = ESLintUtils.getParserServices(context);
  // If it's not a computed property like `foo.bar`, the node is not implicit any since this expression ensures type safety.
  // If an ancestor node have a type annotation like `(foo as any)['key']['key2']`, the given node is not considered as implicit any.
  if (!node.computed || hasTypeAnnotationInAncestorNode(parserServices, node)) return;

  const nodeType = parserServices.getTypeAtLocation(node);
  const objType = parserServices.getTypeAtLocation(node.object);

  if (nodeType.flags === ts.TypeFlags.Any && objType.symbol?.escapedName !== "Array") {
    context.report({
      node,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      *fix(fixer) {
        // Adjusting the position to insert "as any"
        const getRangeAdjustment = () => {
          if (!node.optional) return 1;
          if (!node.computed) return 2;
          return 3;
        };

        yield fixer.insertTextBefore(node, "(");
        yield fixer.insertTextBeforeRange(
          [node.property.range[0] - getRangeAdjustment(), node.property.range[1]],
          " as any)"
        );
      },
    });
  }
};
