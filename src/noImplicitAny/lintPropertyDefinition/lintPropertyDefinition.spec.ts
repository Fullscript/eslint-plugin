import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyPropertyDefinition",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("property-definition", rule, {
  valid: [
    {
      code: `
        class User {
          name: string;
          public email: string;
          protected age: number;
          private password: string;
        }
      `,
    },
    {
      code: `
        class User {
          name = 'my name';
          public email = 'foo@bar.com';
          protected age = 20;
          private password = 'somepassword';
        }
      `,
    },
    {
      code: `
        class User {
          name: any;
          public email: any;
          protected age: any;
          private password: any;
        }
      `,
    },
    {
      code: `
        class User {
          name = undefined as any;
          email = null as any;
          friends = [] as any[];
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        class User {
          name;
          public email;
          protected age
          private password
        }
      `,
      output: `
        class User {
          name: any;
          public email: any;
          protected age: any;
          private password: any;
        }
      `,
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: `
        class User {
          name = undefined;
          email = null;
          age = void 0;
          friends = [];
        }
      `,
      output: `
        class User {
          name = undefined as any;
          email = null as any;
          age = void 0 as any;
          friends = [] as any[];
        }
      `,
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
  ],
});
