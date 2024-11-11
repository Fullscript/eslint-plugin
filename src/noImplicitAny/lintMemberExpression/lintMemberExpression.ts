import { ESLintUtils, type ParserServicesWithTypeInformation } from "@typescript-eslint/utils";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";

import * as ts from "typescript";

function hasTypeAnnotationInAncestors(
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
    return hasTypeAnnotationInAncestors(parserServices, node.object);
  } else {
    return false;
  }
}

export const lintMemberExpression = (
  context: ImplicitAnyContext,
  node: TSESTree.MemberExpression
) => {
  const parserServices = ESLintUtils.getParserServices(context);
  if (!node.computed || hasTypeAnnotationInAncestors(parserServices, node)) return;

  const nodeType = parserServices.getTypeAtLocation(node);
  const objType = parserServices.getTypeAtLocation(node.object);

  if (nodeType.flags === ts.TypeFlags.Any && objType.symbol?.escapedName !== "Array") {
    context.report({
      node,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      *fix(fixer) {
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
