"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintTSPropertySignature", {
    enumerable: true,
    get: function() {
        return lintTSPropertySignature;
    }
});
const _messageIds = require("../messageIds");
const lintTSPropertySignature = (context, node)=>{
    if (!node.typeAnnotation) {
        context.report({
            node,
            messageId: _messageIds.DETECTED_IMPLICIT_ANY_ERROR_KEY,
            *fix (fixer) {
                const key = node.key;
                yield fixer.replaceText(node, key.name);
                yield fixer.insertTextAfter(node, ": any;");
            }
        });
    }
};
