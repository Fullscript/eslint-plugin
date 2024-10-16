import type { TSESTree } from "@typescript-eslint/types";
import { lintTSPropertySignature } from "./lintTSPropertySignature";
import type { ImplicitAnyContext } from "./type";

const DETECTED_IMPLICIT_ANY_ERROR_KEY = "detectedImplicitAny";

export const meta = {
  docs: {
    description: "Disallow implicit any",
  },
  type: "problem",
  messages: {
    [DETECTED_IMPLICIT_ANY_ERROR_KEY]:
      "An implicit any is detected. Add a specific type or an explicit any type.",
  },
  fixable: "code",
  schema: [],
} as const;

function hasJSExtension(filePath: string) {
  return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}

export const create = (context: ImplicitAnyContext) => {
  // Skip JavaScript files because this rule only targets TypeScript files
  if (hasJSExtension(context.filename)) return {};

  return {
    TSPropertySignature: (node: TSESTree.TSPropertySignature) => {
      lintTSPropertySignature(context, node);
    },
    // TODO: comming soon
    // FunctionDeclaration: (node) => {},
    // FunctionExpression: (node) => {},
    // ArrowFunctionExpression: (node) => {},
    // TSFunctionType: (node) => {},
    // VariableDeclarator: (node) => {},
    // MemberExpression: (node) => {},
    // ReturnStatement: (node) => {},
    // ObjectExpression: (node) => {},
    // PropertyDefinition: (node) => {}
  };
};
