import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyMemberExpression",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("member-expression", rule, {
  valid: [
    {
      code: `
        const foo: any = undefined;
        foo['key'];
      `,
    },
    {
      code: `
        const foo = undefined as any;
        foo['key'];
      `,
    },
    {
      code: `
          const foo = { key: 'value' };
          foo['key'];
        `,
    },
    {
      code: `
          const foo = { key: 'value' };
          foo?.['key'];
        `,
    },
    {
      code: `
          const foo = {};
          (foo as any)['key'];
        `,
    },
    {
      code: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)['key3'];
        `,
    },
    {
      code: `
          const foo = {};
          (foo as any)['key']['key2'];
        `,
    },
    {
      code: `
          const foo = {};
          (foo as any).key1.key2;
        `,
    },
    {
      code: `
          const foo = { key: 'value' };
          foo.key;
        `,
    },
    {
      code: `
          const foo = { key: 'value' };
          foo?.key;
        `,
    },
    {
      code: `
          const foo = {};
          foo.key;
        `,
    },
    {
      code: `
          const foo = { key: { key2: {} } };
          foo.key.key2.key3;
        `,
    },
    {
      code: `
          const foo = {};
          foo?.key;
        `,
    },
    {
      code: `
          const foo = { key:  { key2: {} } };
          foo.key.key2?.key3;
        `,
    },
    {
      code: `
          const foo: any[] = [];
          foo[0];
        `,
    },
    {
      code: `
          const foo: { key: any } = { key: '' };
          foo.key;
        `,
    },
  ],
  invalid: [
    {
      code: `
          const foo = {};
          foo['key'];
        `,
      output: `
          const foo = {};
          (foo as any)['key'];
        `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
          const foo = { key: { key2: {} } };
          foo['key']['key2']['key3'];
        `,
      output: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)['key3'];
        `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
          const foo = {};
          foo?.['key'];
        `,
      output: `
          const foo = {};
          (foo as any)?.['key'];
        `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
          const foo = { key: { key2: {} } };
          foo['key']['key2']?.['key3'];
        `,
      output: `
          const foo = { key: { key2: {} } };
          (foo['key']['key2'] as any)?.['key3'];
        `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
    {
      code: `
        function fn (arg: { foo: string }) {
          const keyName: string = 'bar';
          arg[keyName];
        }
        `,
      output: `
        function fn (arg: { foo: string }) {
          const keyName: string = 'bar';
          (arg as any)[keyName];
        }
        `,
      errors: [{ messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY }],
    },
  ],
});
