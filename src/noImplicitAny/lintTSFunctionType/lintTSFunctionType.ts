import type { TSESTree } from "@typescript-eslint/types";
import type { ImplicitAnyContext } from "../type";
import { lintFunctionArgument } from "../lintFunctionUtils";

export const lintTSFunctionType = (context: ImplicitAnyContext, node: TSESTree.TSFunctionType) => {
  node.params.forEach(arg => {
    // Lint function arguments individually
    lintFunctionArgument(context, arg);
  });
};
