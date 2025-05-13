"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "lintTSFunctionType", {
    enumerable: true,
    get: ()=>lintTSFunctionType
});
const _lintFunctionUtils = require("../lintFunctionUtils");
const lintTSFunctionType = (context, node)=>{
    node.params.forEach((arg)=>{
        // Lint function arguments individually
        (0, _lintFunctionUtils.lintFunctionArgument)(context, arg);
    });
};
