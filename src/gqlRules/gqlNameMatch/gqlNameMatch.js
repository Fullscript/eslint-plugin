import { isGqlFile } from "../utils";
import { isQuery, isMutation } from "../utils/isGQLOperation";
import { relativePathToFile } from "../../utils";
import { operationName } from "../utils/operationName";
import { sanitizeGqlOperationText } from "../utils/sanitizeGqlOperationText";

const meta = {
  type: "problem",
  docs: {
    description:
      "The Variable name GQL operation is assigned should match with the GQL operation name Ex: const Patient_Query_UserAvatar = gql` query Patient_Query_UserAvatar...`",
    category: "gql-name-match",
    recommended: false,
  },
  fixable: "code",
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
        namespaceOperationPrefix: {
          type: "object",
        },
      },
      required: ["namespaceOperationPrefix"],
      additionalProperties: false,
    },
  ],
};

const create = context => {
  const isGqlObjectFile = isGqlFile(context);
  const { namespaceOperationPrefix, namespaceIgnoreList } = context.options[0];

  const isGqlTemplateElement = node => {
    return node.tag && node.tag.name === "gql";
  };

  const getNamespaceAndPrefix = () => {
    const pathToFile = relativePathToFile(context);
    const relativeJsPath = pathToFile.replace("app/javascript/", "");

    const namespace = Object.keys(namespaceOperationPrefix).find(namespaceOperationKey =>
      relativeJsPath.startsWith(namespaceOperationKey)
    );

    return { namespace, operationPrefix: namespaceOperationPrefix[namespace] };
  };

  const isInIgnoreList = namespace => {
    return namespaceIgnoreList.includes(namespace);
  };

  const validateOperationName = (gqlOperationText, operationType, node) => {
    const gqlOperationName = operationName(gqlOperationText, operationType);
    const { namespace } = getNamespaceAndPrefix();
    const { id } = node;
    const variableName = id.name;
    if (isInIgnoreList(namespace)) {
      return;
    }

    const isOperationNameValid = !!gqlOperationName.match(variableName);

    if (!isOperationNameValid) {
      context.report({
        node: node,
        message: `"${variableName}" is not a valid operation name, please use "${gqlOperationName}"`,
      });
    }
  };

  const VariableDeclarator = node => {
    if (!isGqlObjectFile || !isGqlTemplateElement(node.init)) return;
    const { init } = node;
    const templateElementNode = init.quasi;
    const gqlOperationText = sanitizeGqlOperationText(templateElementNode, context);

    if (isQuery(gqlOperationText)) {
      validateOperationName(gqlOperationText, "Query", node);
    } else if (isMutation(gqlOperationText)) {
      validateOperationName(gqlOperationText, "Mutation", node);
    }
  };

  return {
    VariableDeclarator,
  };
};

export { meta, create };
