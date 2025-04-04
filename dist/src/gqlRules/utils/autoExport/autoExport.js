"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "autoExportObject", {
    enumerable: true,
    get: function() {
        return autoExportObject;
    }
});
const appendToExistingExport = (fixer, sourceCode, exports1, nodeName)=>{
    const exportSourceCode = sourceCode.getText(exports1[0]);
    const isSingleLine = exportSourceCode.includes(" };");
    let exportStatement;
    if (isSingleLine) {
        exportStatement = exportSourceCode.split(" };");
        return fixer.replaceText(exports1[0], `${exportStatement[0]}, ${nodeName} };`);
    }
    exportStatement = exportSourceCode.split("};");
    return fixer.replaceText(exports1[0], `${exportStatement[0]}  ${nodeName},\n};`);
};
const writeNewExport = (fixer, sourceCode, programNode, nodeName, exportStatement)=>{
    const lastToken = sourceCode.getLastToken(programNode);
    return fixer.insertTextAfter(lastToken, `\n\n${exportStatement} { ${nodeName} };`);
};
/**
 * For fixing "export" statements that don't export all the required functions/consts etc
 */ const autoExportObject = (fixer, context, programNode, exports1, nodeName)=>{
    const sourceCode = context.getSourceCode();
    // if an export statement exists
    if (exports1[0]) {
        return appendToExistingExport(fixer, sourceCode, exports1, nodeName);
    }
    // If no export statement exists yet
    return writeNewExport(fixer, sourceCode, programNode, nodeName, "export");
};
