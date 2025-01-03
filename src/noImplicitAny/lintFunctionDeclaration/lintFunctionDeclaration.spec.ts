import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyFunctionDeclaration",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("function-declaration", rule, {
  valid: [
    {
      code: "function foo (arg1: any, arg2: any) {}",
    },
    {
      code: 'function foo (arg = "") {}',
    },
    {
      code: "function foo (arg1: any = null, arg2: any = undefined, arg3: any = void 0, arg4: any[] = []) {}",
    },
    {
      code: "function foo ({ a: { b: { c } } }: any) {}",
    },
    {
      code: "function foo ({ arg1, arg2 }: any) {}",
    },
    {
      code: "function foo ({ ...rest }) {}",
    },
    {
      code: "function foo ({ ...rest }: any) {}",
    },
    {
      code: "function foo ({ arg1, ...rest }: any) {}",
    },
    {
      code: "function foo (...args: any[]) {}",
    },
    {
      code: "function foo (arg1: any, ...args: any[]) {}",
    },
  ],
  invalid: [
    {
      code: "function foo (arg1, arg2) {}",
      output: "function foo (arg1: any, arg2: any) {}",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: "function foo (arg1 = null, arg2 = undefined, arg3 = void 0, arg4 = []) {}",
      output:
        "function foo (arg1: any = null, arg2: any = undefined, arg3: any = void 0, arg4: any[] = []) {}",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: "function foo ({ a: { b: { c } } }) {}",
      output: "function foo ({ a: { b: { c } } }: any) {}",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "function foo ({ arg1, arg2 }) {}",
      output: "function foo ({ arg1, arg2 }: any) {}",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "function foo ({ arg1, ...rest }) {}",
      output: "function foo ({ arg1, ...rest }: any) {}",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "function foo (...args) {}",
      output: "function foo (...args: any[]) {}",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "function foo ([arg1, arg2]) {}",
      output: "function foo ([arg1, arg2]: any[]) {}",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
