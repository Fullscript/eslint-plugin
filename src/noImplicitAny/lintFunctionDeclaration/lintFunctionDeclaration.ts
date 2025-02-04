import type { TSESTree } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { lintFunctionArgument } from "../lintFunctionUtils";

export const lintFunctionDeclaration = (
  context: ImplicitAnyContext,
  node: TSESTree.FunctionDeclaration
) => {
  node.params.forEach(arg => {
    // Lint function arguments individually
    lintFunctionArgument(context, arg);
  });
};
