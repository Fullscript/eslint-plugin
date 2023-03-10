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

const create = context => {
  const isGqlObjectFile = isGqlFile(context);
  const [{ namespaceIgnoreList }] = context.options;

  const isInIgnoreList = () => {
    const pathToFile = relativePathToFile(context);
    return namespaceIgnoreList.some(ignoredNamespace => pathToFile.startsWith(ignoredNamespace));
  };

  const isOperationNameAndVariableNameSame = (gqlOperationText, node) => {
    const operationType = isQuery(gqlOperationText) ? "Query" : "Mutation";
    const gqlOperationName = operationName(gqlOperationText, operationType);
    const { id } = node;
    const variableName = id.name;
    if (isInIgnoreList()) {
      return;
    }

    const isOperationNameValid = !!gqlOperationName.match(variableName);

    if (!isOperationNameValid) {
      context.report({
        node: node,
        message: `The variable name "${variableName}" should match with the GQL operation name, please use "${gqlOperationName}"`,
      });
    }
  };

  const VariableDeclarator = node => {
    if (!isGqlObjectFile || !isGqlTemplateElement(node.init)) return;
    const { init } = node;
    const templateElementNode = init.quasi;
    const gqlOperationText = sanitizeGqlOperationText(templateElementNode, context);
    isOperationNameAndVariableNameSame(gqlOperationText, node);
  };

  return {
    VariableDeclarator,
  };
};

export { meta, create };
