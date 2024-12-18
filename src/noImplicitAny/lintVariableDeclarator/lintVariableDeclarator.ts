import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from "../../utils";

export const lintVariableDeclarator = (
  context: ImplicitAnyContext,
  node: TSESTree.VariableDeclarator
) => {
  if (
    node.id.typeAnnotation ||
    node.parent.parent.type === AST_NODE_TYPES.ForOfStatement ||
    node.parent.parent.type === AST_NODE_TYPES.ForInStatement
  ) {
    return;
  }

  if (node.init === null) {
    return context.report({
      node,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      fix(fixer) {
        return fixer.insertTextAfter(node.id, ": any");
      },
    });
  }

  // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
  // In that case, type annotation should be added to avoid implicit any.
  // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
  // Therefore, we don't need to add type annotation
  if (!enabledStrictNullChecks(context)) {
    if (isNullOrUndefinedOrVoid(node.init)) {
      context.report({
        node,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(node.id, ": any");
        },
      });
    } else if (
      node.init.type === AST_NODE_TYPES.ArrayExpression &&
      node.init.elements.length === 0
    ) {
      context.report({
        node,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(node.id, ": any[]");
        },
      });
    }
  }
};
