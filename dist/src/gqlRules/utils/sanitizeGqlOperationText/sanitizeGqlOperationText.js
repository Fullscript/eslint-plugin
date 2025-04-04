"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "sanitizeGqlOperationText", {
    enumerable: true,
    get: function() {
        return sanitizeGqlOperationText;
    }
});
const _isGQLOperation = require("../isGQLOperation");
const sanitizeGqlOperationText = (node, context)=>{
    const sourceCode = context.getSourceCode();
    const templateText = sourceCode.getText(node);
    const linesArray = templateText.replace(/\`/gm, "").split("\n");
    const gqlOperationLine = linesArray.find((line)=>{
        const trimmedLine = line.trim();
        return (0, _isGQLOperation.isQuery)(trimmedLine) || (0, _isGQLOperation.isMutation)(trimmedLine);
    });
    return gqlOperationLine && gqlOperationLine.trim() || "";
};
