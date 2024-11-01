import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyObjectExpression",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("object-expression", rule, {
  valid: [
    { code: "const foo = { a: 1 }" },
    { code: "const foo = { a: null } as any" },
    { code: "const foo: any = { a: null }" },
    { code: "const foo = ({ ...rest }) => {}" },
  ],
  invalid: [
    {
      code: "const foo = { a: null }",
      output: "const foo = { a: null as any }",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = { a: undefined }",
      output: "const foo = { a: undefined as any }",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = { a: void 0 }",
      output: "const foo = { a: void 0 as any }",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: "const foo = { a: [] }",
      output: "const foo = { a: [] as any[] }",
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
