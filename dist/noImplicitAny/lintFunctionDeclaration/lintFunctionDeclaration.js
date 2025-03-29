"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintFunctionDeclaration", {
    enumerable: true,
    get: ()=>lintFunctionDeclaration
});
const _lintFunctionUtils = require("../lintFunctionUtils");
const lintFunctionDeclaration = (context, node)=>{
    node.params.forEach((arg)=>{
        // Lint function arguments individually
        (0, _lintFunctionUtils.lintFunctionArgument)(context, arg);
    });
};
