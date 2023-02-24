import { isQuery, isMutation } from "../isGQLOperation";

const sanitizeGqlOperationText = (node, context) => {
  const sourceCode = context.getSourceCode();
  const templateText = sourceCode.getText(node);
  const linesArray = templateText.replace(/\`/gm, "").split("\n");

  const gqlOperationLine = linesArray.find(line => {
    const trimmedLine = line.trim();
    return isQuery(trimmedLine) || isMutation(trimmedLine);
  });

  return (gqlOperationLine && gqlOperationLine.trim()) || "";
};

export { sanitizeGqlOperationText };
