"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _noImplicitAny = require("../noImplicitAny");
const _messageIds = require("../messageIds");
const _testUtils = require("../../testUtils");
const rule = (0, _testUtils.createRule)({
    name: "noImplicitAnyTSPropertySignature",
    defaultOptions: [],
    meta: _noImplicitAny.meta,
    create: _noImplicitAny.create
});
_testUtils.ruleTester.run("ts-property-signature", rule, {
    valid: [
        {
            code: `
          type Foo = {
            property1: string;
            nestedObject: {
              property2: number;
            }
          }
        `
        },
        {
            code: `
        interface Foo {
          property1: string;
          nestedObject: {
            property2: number;
          }
        }
      `
        }
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
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                },
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
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
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                },
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        }
    ]
});
