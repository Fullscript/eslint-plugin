import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from "../../utils";

import * as ts from "typescript";

export const lintPropertyDefinition = (
  context: ImplicitAnyContext,
  node: TSESTree.PropertyDefinition
) => {
  const key = node.key;
  if (node.typeAnnotation) return;
  if (key.type === AST_NODE_TYPES.Identifier && key.typeAnnotation) return;

  const parserServices = ESLintUtils.getParserServices(context);
  const type = parserServices.getTypeAtLocation(node);
  const value = node.value;

  if (!value && type.flags === ts.TypeFlags.Any) {
    return context.report({
      node,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      *fix(fixer) {
        const propertyName = (key as TSESTree.Identifier).name;
        const text = node.accessibility ? `${node.accessibility} ${propertyName}` : propertyName;
        yield fixer.replaceText(node, text);
        yield fixer.insertTextAfter(node, ": any;");
      },
    });
  }

  // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
  // In that case, type annotation should be added to avoid implicit any.
  // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
  // Therefore, we don't need to add type annotation
  if (!enabledStrictNullChecks(context)) {
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
  }
};
