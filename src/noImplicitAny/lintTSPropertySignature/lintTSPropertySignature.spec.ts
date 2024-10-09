import { create, meta } from "../noImplicitAny";
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from "../messageIds";
import { ruleTester, createRule } from "../../testUtils";

const rule = createRule({
  name: "noImplicitAnyTSPropertySignature",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("ts-property-signature", rule, {
  valid: [
    {
      code: `
          type Foo = {
            property1: string;
            nestedObject: {
              property2: number;
            }
          }
        `,
    },
    {
      code: `
        interface Foo {
          property1: string;
          nestedObject: {
            property2: number;
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
          type Foo = {
            property1;
            nestedObject: {
              property2
            }
          }
        `,
      output: `
          type Foo = {
            property1: any;
            nestedObject: {
              property2: any;
            }
          }
        `,
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
    {
      code: `
          interface Foo {
            property1;
            nestedObject: {
              property2
            }
          }
        `,
      output: `
          interface Foo {
            property1: any;
            nestedObject: {
              property2: any;
            }
          }
        `,
      errors: [
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
        { messageId: DETECTED_IMPLICIT_ANY_ERROR_KEY },
      ],
    },
  ],
});
