import type { ImplicitAnyContext } from "./type";
import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import { isNullOrUndefinedOrVoid, enabledStrictNullChecks } from "../utils";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "./messageIds";
import * as ts from "typescript";

export const lintFunctionArgument = (context: ImplicitAnyContext, arg: TSESTree.Parameter) => {
  if (arg["typeAnnotation"]) return;

  const parserServices = ESLintUtils.getParserServices(context);

  // Lint assignment pattern
  // ex: function fn(arg = null) {}
  if (arg.type === AST_NODE_TYPES.AssignmentPattern) {
    // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
    // In that case, type annotation should be added to avoid implicit any.
    // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
    // Therefore, we don't need to add type annotation
    if (arg.left.typeAnnotation || enabledStrictNullChecks(context)) return;

    const right = arg.right;
    if (isNullOrUndefinedOrVoid(right)) {
      context.report({
        node: arg.left,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(arg.left, ": any");
        },
      });
    } else if (right.type === AST_NODE_TYPES.ArrayExpression && right.elements.length === 0) {
      context.report({
        node: arg.left,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(arg.left, ": any[]");
        },
      });
    }
    return;
  }

  const type = parserServices.getTypeAtLocation(arg);

  if (type.flags === ts.TypeFlags.Any) {
    context.report({
      node: arg,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      *fix(fixer) {
        const after = context.sourceCode.getTokenAfter(arg);

        if (arg.parent["params"]?.length === 1 && after.value == "=>") {
          // ex: arg => (arg: any)
          yield fixer.insertTextBefore(arg, "(");
          yield fixer.insertTextAfter(arg, ": any)");
        } else {
          // ex: (arg) => (arg: any)
          yield fixer.insertTextAfter(arg, ": any");
        }
      },
    });
  } else if (type.flags === ts.TypeFlags.Object) {
    if (
      arg.type === AST_NODE_TYPES.ObjectPattern &&
      !(arg.properties.length === 1 && arg.properties[0].type === AST_NODE_TYPES.RestElement)
    ) {
      context.report({
        node: arg,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(arg, ": any");
        },
      });
    } else if (
      arg.type === AST_NODE_TYPES.ArrayPattern ||
      arg.type === AST_NODE_TYPES.RestElement
    ) {
      context.report({
        node: arg,
        messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
        fix(fixer) {
          return fixer.insertTextAfter(arg, ": any[]");
        },
      });
    }
  }
};
