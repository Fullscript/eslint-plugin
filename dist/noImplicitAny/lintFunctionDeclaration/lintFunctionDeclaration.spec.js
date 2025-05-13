"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _noImplicitAny = require("../noImplicitAny");
const _messageIds = require("../messageIds");
const _testUtils = require("../../testUtils");
const rule = (0, _testUtils.createRule)({
    name: "noImplicitAnyFunctionDeclaration",
    defaultOptions: [],
    meta: _noImplicitAny.meta,
    create: _noImplicitAny.create
});
_testUtils.ruleTester.run("function-declaration", rule, {
    valid: [
        {
            code: "function foo (arg1: any, arg2: any) {}"
        },
        {
            code: 'function foo (arg = "") {}'
        },
        {
            code: "function foo (arg1: any = null, arg2: any = undefined, arg3: any = void 0, arg4: any[] = []) {}"
        },
        {
            code: "function foo ({ a: { b: { c } } }: any) {}"
        },
        {
            code: "function foo ({ arg1, arg2 }: any) {}"
        },
        {
            code: "function foo ({ ...rest }) {}"
        },
        {
            code: "function foo ({ ...rest }: any) {}"
        },
        {
            code: "function foo ({ arg1, ...rest }: any) {}"
        },
        {
            code: "function foo (...args: any[]) {}"
        },
        {
            code: "function foo (arg1: any, ...args: any[]) {}"
        }
    ],
    invalid: [
        {
            code: "function foo (arg1, arg2) {}",
            output: "function foo (arg1: any, arg2: any) {}",
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
            code: "function foo (arg1 = null, arg2 = undefined, arg3 = void 0, arg4 = []) {}",
            output: "function foo (arg1: any = null, arg2: any = undefined, arg3: any = void 0, arg4: any[] = []) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                },
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                },
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                },
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "function foo ({ a: { b: { c } } }) {}",
            output: "function foo ({ a: { b: { c } } }: any) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "function foo ({ arg1, arg2 }) {}",
            output: "function foo ({ arg1, arg2 }: any) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "function foo ({ arg1, ...rest }) {}",
            output: "function foo ({ arg1, ...rest }: any) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "function foo (...args) {}",
            output: "function foo (...args: any[]) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        },
        {
            code: "function foo ([arg1, arg2]) {}",
            output: "function foo ([arg1, arg2]: any[]) {}",
            errors: [
                {
                    messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY
                }
            ]
        }
    ]
});
