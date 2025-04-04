"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintObjectExpression", {
    enumerable: true,
    get: function() {
        return lintObjectExpression;
    }
});
const _types = require("@typescript-eslint/types");
const _messageIds = require("../messageIds");
const _utils = require("../../utils");
const lintObjectExpression = (context, node)=>{
    const parent = node.parent;
    if ((0, _utils.enabledStrictNullChecks)(context) || parent.type === _types.AST_NODE_TYPES.TSAsExpression || parent.type === _types.AST_NODE_TYPES.VariableDeclarator && parent.id.typeAnnotation) return;
    node.properties.forEach((property)=>{
        if (property.type === _types.AST_NODE_TYPES.SpreadElement) return;
        const value = property.value;
        if ((0, _utils.isNullOrUndefinedOrVoid)(value)) {
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
    });
};
