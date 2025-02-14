import { type TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { ESLintUtils } from "@typescript-eslint/utils";
import type { ImplicitAnyContext } from "../type";
import { lintFunctionArgument } from "../lintFunctionUtils";
import { findNode } from "../../utils";

export const lintFunctionExpression = (
  context: ImplicitAnyContext,
  node: TSESTree.FunctionExpression
) => {
  // Arguments of FunctionExpression in JSXExpressionContainer will not be linted since they're supposed to be linted in the Component props definition
  // Example:
  //   const TestComponent = ({ onClick }) => <button onClick={onClick} />;
  //   <TestComponent onClick={function (arg) {}} />;
  //   In this case, "arg" is implicit any but it should have type defenition when `onClick` is defined in `TestComponent` props.
  if (node.parent.type === AST_NODE_TYPES.JSXExpressionContainer) return;

  // When a function is in CallExpression
  // ex) array.forEach(function (arg) {});
  if (node.parent.type === AST_NODE_TYPES.CallExpression) {
    const parserServices = ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(node.parent.callee);

    // a callee which has value declaration should be linted in VariableDeclarator
    if (type.symbol && type.symbol.valueDeclaration) return;

    // When a callee is defined as FunctionDeclaration, it should be linted in FunctionDeclaration
    // Example:
    //   function fn(callback) { callback(); }
    //   fn(function (arg) {});
    if (type.symbol && node.parent.callee.type === AST_NODE_TYPES.Identifier) return;
  }

  // When a function is in a property of an object
  // Example: const obj = { key: function (arg) {} };
  if (node.parent.type === AST_NODE_TYPES.Property) {
    // Traverse the AST to get type annotation
    // if it has type annotation, it doesn't have to be linted
    // Example1: const obj: { key: (arg: string) => void } = { key: function (arg) {} };
    // Example2: const obj: any = { key: function (arg) {} };
    const variableDclaratorNode: TSESTree.VariableDeclarator | null = findNode(
      [AST_NODE_TYPES.VariableDeclarator],
      node.parent
    );
    if (variableDclaratorNode && variableDclaratorNode.id.typeAnnotation) return;

    const callExpressionNode: TSESTree.CallExpression | null = findNode(
      [AST_NODE_TYPES.CallExpression],
      node.parent.parent.parent
    );
    if (callExpressionNode) {
      const parserServices = ESLintUtils.getParserServices(context);
      const type = parserServices.getTypeAtLocation(callExpressionNode.callee);

      // a callee which has value declaration should be linted in VariableDeclarator
      if (type.symbol && type.symbol.valueDeclaration) return;
      // When a callee is defined as FunctionDeclaration, it should be linted in FunctionDeclaration
      // Example:
      //   function fn(obj) {}
      //   fn({ key: function (arg) {} });
      if (type.symbol && callExpressionNode.callee.type === AST_NODE_TYPES.Identifier) return;
    }
  }

  node.params.forEach(arg => {
    lintFunctionArgument(context, arg);
  });
};
