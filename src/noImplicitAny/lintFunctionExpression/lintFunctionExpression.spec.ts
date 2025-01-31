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
    {
      code: "const arrayObjFunc = [{ key: function (arg: any) {} }];",
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
      code: "const arrayObjFunc = [{ key: function (arg) {} }];",
      output: "const arrayObjFunc = [{ key: function (arg: any) {} }];",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
