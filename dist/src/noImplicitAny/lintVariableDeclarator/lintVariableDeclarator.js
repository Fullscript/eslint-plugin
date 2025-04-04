"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintVariableDeclarator", {
    enumerable: true,
    get: function() {
        return lintVariableDeclarator;
    }
});
const _types = require("@typescript-eslint/types");
const _messageIds = require("../messageIds");
const _utils = require("../../utils");
const lintVariableDeclarator = (context, node)=>{
    if (node.id.typeAnnotation || node.parent.parent.type === _types.AST_NODE_TYPES.ForOfStatement || node.parent.parent.type === _types.AST_NODE_TYPES.ForInStatement) {
        return;
    }
    if (node.init === null) {
        return context.report({
            node,
            messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
            fix (fixer) {
                return fixer.insertTextAfter(node.id, ": any");
            }
        });
    }
    // When strictNullChecks is disabled, null, undefined, void are infered as implicit any.
    // In that case, type annotation should be added to avoid implicit any.
    // On the other hand, when strictNullChecks is enabled, null, undefined and void are infered as null or undefined (void is infered as undefined).
    // Therefore, we don't need to add type annotation
    if (!(0, _utils.enabledStrictNullChecks)(context)) {
        if ((0, _utils.isNullOrUndefinedOrVoid)(node.init)) {
            context.report({
                node,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(node.id, ": any");
                }
            });
        } else if (node.init.type === _types.AST_NODE_TYPES.ArrayExpression && node.init.elements.length === 0) {
            context.report({
                node,
                messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
                fix (fixer) {
                    return fixer.insertTextAfter(node.id, ": any[]");
                }
            });
        }
    }
};
