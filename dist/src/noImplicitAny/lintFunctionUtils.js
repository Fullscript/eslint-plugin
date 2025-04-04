"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintFunctionArgument", {
    enumerable: true,
    get: function() {
        return lintFunctionArgument;
    }
});
const _types = require("@typescript-eslint/types");
const _utils = require("@typescript-eslint/utils");
const _utils1 = require("../utils");
const _messageIds = require("./messageIds");
const _typescript = /*#__PURE__*/ _interop_require_wildcard(require("typescript"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const lintFunctionArgument = (context, arg)=>{
    if (arg["typeAnnotation"]) return;
    const parserServices = _utils.ESLintUtils.getParserServices(context);
    // Lint assignment pattern
    // ex: function fn(arg = null) {}
    if (arg.type === _types.AST_NODE_TYPES.AssignmentPattern) {
        // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
        // In that case, type annotation should be added to avoid implicit any.
        // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
        // Therefore, we don't need to add type annotation
        if (arg.left.typeAnnotation || (0, _utils1.enabledStrictNullChecks)(context)) return;
        const right = arg.right;
        if ((0, _utils1.isNullOrUndefinedOrVoid)(right)) {
            context.report({
                node: arg.left,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(arg.left, ": any");
                }
            });
        } else if (right.type === _types.AST_NODE_TYPES.ArrayExpression && right.elements.length === 0) {
            context.report({
                node: arg.left,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(arg.left, ": any[]");
                }
            });
        }
        return;
    }
    const type = parserServices.getTypeAtLocation(arg);
    if (type.flags === _typescript.TypeFlags.Any) {
        context.report({
            node: arg,
            messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
            *fix (fixer) {
                var _arg_parent_params;
                const after = context.sourceCode.getTokenAfter(arg);
                if (((_arg_parent_params = arg.parent["params"]) === null || _arg_parent_params === void 0 ? void 0 : _arg_parent_params.length) === 1 && after.value == "=>") {
                    // ex: arg => (arg: any)
                    yield fixer.insertTextBefore(arg, "(");
                    yield fixer.insertTextAfter(arg, ": any)");
                } else {
                    // ex: (arg) => (arg: any)
                    yield fixer.insertTextAfter(arg, ": any");
                }
            }
        });
    } else if (type.flags === _typescript.TypeFlags.Object) {
        if (arg.type === _types.AST_NODE_TYPES.ObjectPattern && !(arg.properties.length === 1 && arg.properties[0].type === _types.AST_NODE_TYPES.RestElement)) {
            context.report({
                node: arg,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(arg, ": any");
                }
            });
        } else if (arg.type === _types.AST_NODE_TYPES.ArrayPattern || arg.type === _types.AST_NODE_TYPES.RestElement) {
            context.report({
                node: arg,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(arg, ": any[]");
                }
            });
        }
    }
};
