import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from "../../utils";

export const lintObjectExpression = (
  context: ImplicitAnyContext,
  node: TSESTree.ObjectExpression
) => {
  const parent = node.parent;
  if (
    enabledStrictNullChecks(context) ||
    parent.type === AST_NODE_TYPES.TSAsExpression ||
    (parent.type === AST_NODE_TYPES.VariableDeclarator && parent.id.typeAnnotation)
  )
    return;

  node.properties.forEach(property => {
    if (property.type === AST_NODE_TYPES.SpreadElement) return;

    const value = property.value;

    if (isNullOrUndefinedOrVoid(value)) {
      context.report({
        node: value,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(value, " as any");
        },
      });
    } else if (value.type === AST_NODE_TYPES.ArrayExpression && value.elements.length === 0) {
      context.report({
        node: value,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(value, " as any[]");
        },
      });
    }
  });
};
