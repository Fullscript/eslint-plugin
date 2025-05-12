"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _noImplicitAny = require("../noImplicitAny");
const _messageIds = require("../messageIds");
const _testUtils = require("../../testUtils");
const rule = (0, _testUtils.createRule)({
    name: "noImplicitAnyTSFunctionType",
    defaultOptions: [],
    meta: _noImplicitAny.meta,
    create: _noImplicitAny.create
});
_testUtils.ruleTester.run("ts-function-type", rule, {
    valid: [
        {
            code: "type Foo = (arg: any) => void;"
        },
        {
            code: `
      type Foo = {
        fn: (arg: any) => void;
      }
    `
        },
        {
            code: `
      interface Foo {
        fn: (arg: any) => void;
      }
    `
        }
    ],
    invalid: [
        {
            code: "type Foo = (arg) => void;",
            output: "type Foo = (arg: any) => void;",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
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
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
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
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        }
    ]
});
