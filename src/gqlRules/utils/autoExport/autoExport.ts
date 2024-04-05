const appendToExistingExport = (fixer, sourceCode, exports, nodeName) => {
  const exportSourceCode = sourceCode.getText(exports[0]);
  const isSingleLine = exportSourceCode.includes(" };");
  let exportStatement;

  if (isSingleLine) {
    exportStatement = exportSourceCode.split(" };");
    return fixer.replaceText(exports[0], `${exportStatement[0]}, ${nodeName} };`);
  }

  exportStatement = exportSourceCode.split("};");
  return fixer.replaceText(exports[0], `${exportStatement[0]}  ${nodeName},\n};`);
};

const writeNewExport = (fixer, sourceCode, programNode, nodeName, exportStatement) => {
  const lastToken = sourceCode.getLastToken(programNode);
  return fixer.insertTextAfter(lastToken, `\n\n${exportStatement} { ${nodeName} };`);
};

/**
 * For fixing "export" statements that don't export all the required functions/consts etc
 */
const autoExportObject = (fixer, context, programNode, exports, nodeName) => {
  const sourceCode = context.getSourceCode();

  // if an export statement exists
  if (exports[0]) {
    return appendToExistingExport(fixer, sourceCode, exports, nodeName);
  }

  // If no export statement exists yet
  return writeNewExport(fixer, sourceCode, programNode, nodeName, "export");
};

export { autoExportObject };
