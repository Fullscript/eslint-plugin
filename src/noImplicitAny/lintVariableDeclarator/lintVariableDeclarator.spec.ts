import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyVariableDeclarator",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("variable-declarator", rule, {
  valid: [
    {
      code: "const foo: any;",
    },
    {
      code: `
          const foo: any = {};
          const val = foo.bar;
        `,
    },
    {
      code: `
            const foo = () => ({ bar: '1' });
            const returnValue = foo();
          `,
    },
    {
      code: `
            const foo = () => ({ bar: '1' });
            const { bar } = foo();
          `,
    },
    {
      code: `
            const foo = (): any => 'test';
            const val = foo();
          `,
    },
    {
      code: `
            const foo = () => ([1, 2]);
            const [num1, num2] = foo();
          `,
    },
    {
      code: `
            const obj: any = { a: 1, b: 2 }
            for (const property in obj) {}
          `,
    },
    {
      code: `
            const arr: any = [1, 2]
            for (const el of arr) {}
          `,
    },
    {
      code: "const foo = [1]",
    },
    {
      code: "const foo: any = []",
    },
  ],
  invalid: [
    {
      code: "const foo;",
      output: "const foo: any;",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo, bar;",
      output: "const foo: any, bar: any;",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: "const foo = null",
      output: "const foo: any = null",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = undefined",
      output: "const foo: any = undefined",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = void 0",
      output: "const foo: any = void 0",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "let foo;",
      output: "let foo: any;",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "let foo, bar;",
      output: "let foo: any, bar: any;",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: "let foo = null",
      output: "let foo: any = null",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "let foo = undefined",
      output: "let foo: any = undefined",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "let foo = void 0",
      output: "let foo: any = void 0",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "var foo;",
      output: "var foo: any;",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "var foo, bar;",
      output: "var foo: any, bar: any;",
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: "var foo = null",
      output: "var foo: any = null",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "var foo = undefined",
      output: "var foo: any = undefined",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "var foo = void 0",
      output: "var foo: any = void 0",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = []",
      output: "const foo: any[] = []",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "let foo = []",
      output: "let foo: any[] = []",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "var foo = []",
      output: "var foo: any[] = []",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
