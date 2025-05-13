"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _noImplicitAny = require("../noImplicitAny");
const _messageIds = require("../messageIds");
const _testUtils = require("../../testUtils");
const rule = (0, _testUtils.createRule)({
    name: "noImplicitAnyObjectExpression",
    defaultOptions: [],
    meta: _noImplicitAny.meta,
    create: _noImplicitAny.create
});
_testUtils.ruleTester.run("object-expression", rule, {
    valid: [
        {
            code: "const foo = { a: 1 }"
        },
        {
            code: "const foo = { a: null } as any"
        },
        {
            code: "const foo: any = { a: null }"
        },
        {
            code: "const foo = ({ ...rest }) => {}"
        }
    ],
    invalid: [
        {
            code: "const foo = { a: null }",
            output: "const foo = { a: null as any }",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "const foo = { a: undefined }",
            output: "const foo = { a: undefined as any }",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "const foo = { a: void 0 }",
            output: "const foo = { a: void 0 as any }",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "const foo = { a: [] }",
            output: "const foo = { a: [] as any[] }",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        }
    ]
});
