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
const _lintTSPropertySignature = require("./lintTSPropertySignature");
const _lintVariableDeclarator = require("./lintVariableDeclarator");
const _lintPropertyDefinition = require("./lintPropertyDefinition");
const _lintObjectExpression = require("./lintObjectExpression");
const _lintMemberExpression = require("./lintMemberExpression");
const _lintFunctionDeclaration = require("./lintFunctionDeclaration");
const _lintTSFunctionType = require("./lintTSFunctionType");
const DETECTED_IMPLICIT_ANY_ERROR_KEY = "detectedImplicitAny";
const meta = {
    docs: {
        description: "Disallow implicit any"
    },
    type: "problem",
    messages: {
        [DETECTED_IMPLICIT_ANY_ERROR_KEY]: "An implicit any is detected. Add a specific type or an explicit any type."
    },
    fixable: "code",
    schema: []
};
function hasJSExtension(filePath) {
    return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}
const create = (context)=>{
    // Skip JavaScript files because this rule only targets TypeScript files
    if (hasJSExtension(context.filename)) return {};
    return {
        TSPropertySignature: (node)=>{
            (0, _lintTSPropertySignature.lintTSPropertySignature)(context, node);
        },
        VariableDeclarator: (node)=>{
            (0, _lintVariableDeclarator.lintVariableDeclarator)(context, node);
        },
        PropertyDefinition: (node)=>{
            (0, _lintPropertyDefinition.lintPropertyDefinition)(context, node);
        },
        ObjectExpression: (node)=>{
            (0, _lintObjectExpression.lintObjectExpression)(context, node);
        },
        MemberExpression: (node)=>{
            (0, _lintMemberExpression.lintMemberExpression)(context, node);
        },
        FunctionDeclaration: (node)=>{
            (0, _lintFunctionDeclaration.lintFunctionDeclaration)(context, node);
        },
        TSFunctionType: (node)=>{
            (0, _lintTSFunctionType.lintTSFunctionType)(context, node);
        }
    };
};
