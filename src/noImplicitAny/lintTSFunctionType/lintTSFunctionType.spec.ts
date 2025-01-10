import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyTSFunctionType",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("ts-function-type", rule, {
  valid: [
    {
      code: "type Foo = (arg: any) => void;",
    },
    {
      code: `
      type Foo = {
        fn: (arg: any) => void;
      }
    `,
    },
    {
      code: `
      interface Foo {
        fn: (arg: any) => void;
      }
    `,
    },
  ],
  invalid: [
    {
      code: "type Foo = (arg) => void;",
      output: "type Foo = (arg: any) => void;",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
            type Foo = {
              fn: (arg) => void;
            }
          `,
      output: `
            type Foo = {
              fn: (arg: any) => void;
            }
          `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
          interface Foo {
            fn: (arg) => void;
          }
          `,
      output: `
          interface Foo {
            fn: (arg: any) => void;
          }
          `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
