"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "enabledStrictNullChecks", {
    enumerable: true,
    get: ()=>enabledStrictNullChecks
});
const _utils = require("@typescript-eslint/utils");
const enabledStrictNullChecks = (context)=>{
    const parserServices = _utils.ESLintUtils.getParserServices(context);
    const compilerOptions = parserServices.program.getCompilerOptions();
    const { strictNullChecks , strict  } = compilerOptions;
    if (strictNullChecks) return true;
    if (strictNullChecks === undefined && strict) return true;
    return false;
};
