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
// 1. Prevent let declarations in the global scope of test files
// 2. Prevent const declarations of objects and arrays in the global scope of test files
// 3. Allow const declarations of primitive values (strings, numbers, booleans) in the global scope
// 4. Allow both let and const declarations inside functions, classes, or blocks
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
                const isObjectOrArray = declaration.init && (declaration.init.type === "ObjectExpression" || declaration.init.type === "ArrayExpression");
                if (isObjectOrArray) {
                    context.report({
                        node,
                        messageId: _messageIds.NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY
                    });
                }
            }
        }
    };
};
