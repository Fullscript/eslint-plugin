import { type TSESTree } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";

export const lintTSPropertySignature = (
  context: ImplicitAnyContext,
  node: TSESTree.TSPropertySignature
) => {
  if (!node.typeAnnotation) {
    context.report({
      node,
      messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY,
      *fix(fixer) {
        const key = node.key as TSESTree.Identifier;
        yield fixer.replaceText(node, key.name);
        yield fixer.insertTextAfter(node, ": any;");
      },
    });
  }
};
