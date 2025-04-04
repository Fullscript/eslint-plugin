"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    meta: ()=>meta,
    create: ()=>create
});
const _messageIds = require("./messageIds");
const meta = {
    type: "problem",
    docs: {
        description: "Prevents variables in tests from being declared in the global scope",
        category: "no-global-variables-in-tests",
        recommended: false
    },
    messages: {
        [_messageIds.NO_GLOBAL_LET_IN_TESTS_ERROR_KEY]: "'let' declarations are not allowed in the global scope of test files. Use 'const' or move the declaration inside a function/block.",
        [_messageIds.NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY]: "'const' declarations of objects are not allowed in the global scope of test files. Move the declaration inside a function/block."
    },
    schema: [],
    fixable: null
};
const isTestFile = (filename)=>filename.endsWith(".spec.tsx");
const create = (context)=>{
    if (!isTestFile(context.filename)) return;
    return {
        VariableDeclaration: (node)=>{
            // Check if the variable is in a describe block within the test file
            if (node.parent.type === "BlockStatement") return;
            if (node.kind === "let") {
                context.report({
                    node,
                    messageId: _messageIds.NO_GLOBAL_LET_IN_TESTS_ERROR_KEY
                });
            } else if (node.kind === "const") {
                const declaration = node.declarations[0];
                const isTypeObjectOrArray = declaration.init && (declaration.init.type === "ObjectExpression" || declaration.init.type === "ArrayExpression");
                if (isTypeObjectOrArray) {
                    context.report({
                        node,
                        messageId: _messageIds.NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY
                    });
                }
            }
        }
    };
};
