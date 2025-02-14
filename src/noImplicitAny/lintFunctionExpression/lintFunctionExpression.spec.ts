import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyFunctionExpression",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("function-expression", rule, {
  valid: [
    {
      code: "const fn = function (arg1: any, arg2: any) {};",
    },
    // Arguments of FunctionExpression in JSXExpressionContainer will not be linted since they should be linted in the Component props definition
    {
      code: "<TestComponent onClick={function (arg) {}} />;",
      filename: "src/react.tsx",
    },
    {
      code: `
        const array = [1,2,3];
        array.forEach(function (arg: any) {});
      `,
    },
    {
      code: `
        const fn = function (callback: any) {};
        fn(function (arg) {});
      `,
    },
    {
      code: `
        function fn (callback: any) {};
        fn(function (arg) {});
      `,
    },
    {
      code: "const arrayObjFunc = [{ key: function (arg: any) {} }];",
    },
    {
      code: `
        function fn (obj: any) {};
        fn({ key: function (arg) {} });
      `,
    },
  ],
  invalid: [
    {
      code: "const fn = function (arg1, arg2) {};",
      output: "const fn = function (arg1: any, arg2: any) {};",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: `
        const array: any = [];
        array.forEach(function (arg) {});
      `,
      output: `
        const array: any = [];
        array.forEach(function (arg: any) {});
      `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "fn(function (arg) {});",
      output: "fn(function (arg: any) {});",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const arrayObjFunc = [{ key: function (arg) {} }];",
      output: "const arrayObjFunc = [{ key: function (arg: any) {} }];",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "fn({ key: function (arg) {} });",
      output: "fn({ key: function (arg: any) {} });",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
