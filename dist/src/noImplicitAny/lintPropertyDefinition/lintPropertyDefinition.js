"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintPropertyDefinition", {
    enumerable: true,
    get: function() {
        return lintPropertyDefinition;
    }
});
const _types = require("@typescript-eslint/types");
const _utils = require("@typescript-eslint/utils");
const _messageIds = require("../messageIds");
const _utils1 = require("../../utils");
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
const lintPropertyDefinition = (context, node)=>{
    const key = node.key;
    if (node.typeAnnotation) return;
    if (key.type === _types.AST_NODE_TYPES.Identifier && key.typeAnnotation) return;
    const parserServices = _utils.ESLintUtils.getParserServices(context);
    const type = parserServices.getTypeAtLocation(node);
    const value = node.value;
    if (!value && type.flags === _typescript.TypeFlags.Any) {
        return context.report({
            node,
            messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
            *fix (fixer) {
                const propertyName = key.name;
                const text = node.accessibility ? `${node.accessibility} ${propertyName}` : propertyName;
                yield fixer.replaceText(node, text);
                yield fixer.insertTextAfter(node, ": any;");
            }
        });
    }
    // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
    // In that case, type annotation should be added to avoid implicit any.
    // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
    // Therefore, we don't need to add type annotation
    if (!(0, _utils1.enabledStrictNullChecks)(context)) {
        if ((0, _utils1.isNullOrUndefinedOrVoid)(value)) {
            context.report({
                node: value,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(value, " as any");
                }
            });
        } else if (value.type === _types.AST_NODE_TYPES.ArrayExpression && value.elements.length === 0) {
            context.report({
                node: value,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(value, " as any[]");
                }
            });
        }
    }
};
