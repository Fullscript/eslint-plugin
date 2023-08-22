import { isGqlFile } from "../utils";
import { isQuery, isMutation } from "../utils/isGQLOperation";
import { relativePathToFile } from "../../utils";
import { operationName } from "../utils/operationName";
import { sanitizeGqlOperationText } from "../utils/sanitizeGqlOperationText";

const meta = {
  type: "problem",
  docs: {
    description:
      "GQL operations must be named based on the namespace they reside and the type of operation. Ex: Patient_Query_UserAvatar",
    category: "gql-operation-name",
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
        sourcePath: {
          type: "string",
        },
      },
      required: ["namespaceOperationPrefix", "sourcePath"],
      additionalProperties: false,
    },
  ],
};

const create = context => {
  const isGqlObjectFile = isGqlFile(context);
  const {
    namespaceOperationPrefix,
    namespaceIgnoreList: initialNamespaceIgnoreList,
    sourcePath,
  } = context.options[0];

  const namespaceIgnoreList = initialNamespaceIgnoreList ?? [];

  const isGqlTemplateElement = node => {
    return node.tag && node.tag.name === "gql";
  };

  const getNamespaceAndPrefix = () => {
    const pathToFile = relativePathToFile(context);
    const relativeJsPath = pathToFile.replace(sourcePath, "");

    const namespace = Object.keys(namespaceOperationPrefix).find(namespaceOperationKey =>
      relativeJsPath.startsWith(namespaceOperationKey)
    );

    return { namespace, operationPrefix: namespaceOperationPrefix[namespace] };
  };

  const isInIgnoreList = namespace => {
    return namespaceIgnoreList.includes(namespace);
  };

  const operationPrefixMissingError = (operationPrefix, node) => {
    if (!operationPrefix) {
      context.report({
        node: node,
        message: `You must configure "custom-rules/gql-operation-name" with a "namespaceOperationPrefix" for the new namespace`,
      });

      return true;
    }
  };

  const validateOperationName = (gqlOperationText, operationType, node) => {
    const gqlOperationName = operationName(gqlOperationText, operationType);
    const { namespace, operationPrefix } = getNamespaceAndPrefix();

    if (isInIgnoreList(namespace) || operationPrefixMissingError(operationPrefix, node)) {
      return;
    }

    const isOperationNameValid = !!gqlOperationName.match(
      new RegExp(`^\\w+_${operationPrefix}_${operationType}$`)
    );

    if (!isOperationNameValid) {
      context.report({
        node: node,
        message: `"${gqlOperationName}" is not a valid operation name, please use the following format "<name>_${operationPrefix}_${operationType}"`,
      });
    }
  };

  const TaggedTemplateExpression = node => {
    if (!isGqlObjectFile || !isGqlTemplateElement(node)) return;

    const templateElementNode = node.quasi;
    const gqlOperationText = sanitizeGqlOperationText(templateElementNode, context);

    if (isQuery(gqlOperationText)) {
      validateOperationName(gqlOperationText, "Query", templateElementNode);
    } else if (isMutation(gqlOperationText)) {
      validateOperationName(gqlOperationText, "Mutation", templateElementNode);
    }
  };

  return { TaggedTemplateExpression };
};

export { meta, create };
