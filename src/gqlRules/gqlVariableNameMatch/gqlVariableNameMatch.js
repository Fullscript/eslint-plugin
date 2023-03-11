import { isGqlFile, isGqlTemplateElement } from "../utils";
import { isQuery } from "../utils/isGQLOperation";
import { relativePathToFile } from "../../utils";
import { operationName } from "../utils/operationName";
import { sanitizeGqlOperationText } from "../utils/sanitizeGqlOperationText";

const meta = {
  type: "problem",
  docs: {
    description:
      "The variable name to which a GQL template literal is assigned should match the GQL operation name Ex: const Patient_Query_UserAvatar = gql` query Patient_Query_UserAvatar...`",
    category: "gql-variable-name-match",
    recommended: false,
  },
  fixable: null,
  schema: [
    {
      type: "object",
      properties: {
        namespaceIgnoreList: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      additionalProperties: false,
    },
  ],
};

const isInIgnoreList = (ignoreList, pathToFile) =>
  ignoreList.some(name => pathToFile.startsWith(name));

const isOperationNameAndVariableNameSame = (gqlOperationText, node) => {
  const operationType = isQuery(gqlOperationText) ? "Query" : "Mutation";
  const gqlOperationName = operationName(gqlOperationText, operationType);
  const variableName = node.id.name;
  return !!gqlOperationName.match(variableName);
};

const create = context => {
  const pathToFile = relativePathToFile(context);
  const isGqlObjectFile = isGqlFile(context);
  const [{ namespaceIgnoreList }] = context.options;

  const VariableDeclarator = node => {
    if (!isGqlObjectFile) return;
    if (!isGqlTemplateElement(node.init)) return;
    if (isInIgnoreList(namespaceIgnoreList, pathToFile)) return;

    const templateElementNode = node.init.quasi;
    const gqlOperationText = sanitizeGqlOperationText(templateElementNode, context);
    const isOperationNameValid = isOperationNameAndVariableNameSame(gqlOperationText, node);
    if (isOperationNameValid) return;

    context.report({
      node: node,
      message: `The variable name "${variableName}" should match with the GQL operation name, please use "${gqlOperationName}"`,
    });
  };

  return {
    VariableDeclarator,
  };
};

export { meta, create };
