import type { TSESTree } from "@typescript-eslint/types";
import { lintTSPropertySignature } from "./lintTSPropertySignature";
import { lintVariableDeclarator } from "./lintVariableDeclarator";
import { lintPropertyDefinition } from "./lintPropertyDefinition";
import { lintObjectExpression } from "./lintObjectExpression";
import { lintMemberExpression } from "./lintMemberExpression";
import { lintFunctionDeclaration } from "./lintFunctionDeclaration";
import { lintTSFunctionType } from "./lintTSFunctionType";
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
    VariableDeclarator: (node: TSESTree.VariableDeclarator) => {
      lintVariableDeclarator(context, node);
    },
    PropertyDefinition: (node: TSESTree.PropertyDefinition) => {
      lintPropertyDefinition(context, node);
    },
    ObjectExpression: (node: TSESTree.ObjectExpression) => {
      lintObjectExpression(context, node);
    },
    MemberExpression: (node: TSESTree.MemberExpression) => {
      lintMemberExpression(context, node);
    },
    FunctionDeclaration: (node: TSESTree.FunctionDeclaration) => {
      lintFunctionDeclaration(context, node);
    },
    TSFunctionType: (node: TSESTree.TSFunctionType) => {
      lintTSFunctionType(context, node);
    },
    // TODO: comming soon
    // FunctionExpression: (node) => {},
    // ArrowFunctionExpression: (node) => {},
    // ReturnStatement: (node) => {},
  };
};
