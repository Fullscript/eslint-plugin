"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    meta: ()=>meta,
    create: ()=>create
});
const _utils = require("../utils");
const _isGQLOperation = require("../utils/isGQLOperation");
const _utils1 = require("../../utils");
const _operationName = require("../utils/operationName");
const _sanitizeGqlOperationText = require("../utils/sanitizeGqlOperationText");
const meta = {
    type: "problem",
    docs: {
        description: "GQL operations must be named based on the namespace they reside and the type of operation. Ex: Patient_Query_UserAvatar",
        category: "gql-operation-name",
        recommended: false
    },
    fixable: "code",
    schema: [
        {
            type: "object",
            properties: {
                namespaceIgnoreList: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                namespaceOperationPrefix: {
                    type: "object"
                },
                sourcePath: {
                    type: "string"
                }
            },
            required: [
                "namespaceOperationPrefix",
                "sourcePath"
            ],
            additionalProperties: false
        }
    ]
};
const create = (context)=>{
    const { namespaceOperationPrefix , namespaceIgnoreList: initialNamespaceIgnoreList , sourcePath  } = context.options[0];
    const namespaceIgnoreList = initialNamespaceIgnoreList ?? [];
    const isGraphQLFile = (0, _utils.isNativeGqlFile)(context);
    const isTypescriptGqlFile = (0, _utils.isGqlFile)(context);
    const isGqlTemplateElement = (node)=>{
        return node.tag && node.tag.name === "gql";
    };
    const getNamespaceAndPrefix = ()=>{
        const pathToFile = (0, _utils1.relativePathToFile)(context);
        const relativeJsPath = pathToFile.replace(sourcePath, "");
        let namespace = null;
        const namespaceKeys = Object.keys(namespaceOperationPrefix);
        for (const key of namespaceKeys){
            if (relativeJsPath.startsWith(key)) {
                namespace = key;
                break;
            }
        }
        return {
            namespace,
            operationPrefix: namespaceOperationPrefix[namespace]
        };
    };
    const isInIgnoreList = (namespace)=>{
        return namespaceIgnoreList.includes(namespace);
    };
    const operationPrefixMissingError = (operationPrefix, node)=>{
        if (!operationPrefix) {
            context.report({
                node: node,
                message: `You must configure "custom-rules/gql-operation-name" with a "namespaceOperationPrefix" for the new namespace`
            });
            return true;
        }
    };
    const validateOperationName = (gqlOperationText, operationType, node)=>{
        const gqlOperationName = (0, _operationName.operationName)(gqlOperationText, operationType);
        const { namespace , operationPrefix  } = getNamespaceAndPrefix();
        if (isInIgnoreList(namespace) || operationPrefixMissingError(operationPrefix, node)) {
            return;
        }
        const isOperationNameValid = !!gqlOperationName.match(new RegExp(`^\\w+_${operationPrefix}_${operationType}$`));
        if (!isOperationNameValid) {
            context.report({
                node: node,
                message: `"${gqlOperationName}" is not a valid operation name, please use the following format "<name>_${operationPrefix}_${operationType}"`
            });
        }
    };
    // Handle TypeScript template literals with gql tag
    const TaggedTemplateExpression = (node)=>{
        if (!isTypescriptGqlFile || !isGqlTemplateElement(node)) return;
        const templateElementNode = node.quasi;
        const gqlOperationText = (0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(templateElementNode, context);
        if ((0, _isGQLOperation.isQuery)(gqlOperationText)) {
            validateOperationName(gqlOperationText, "Query", templateElementNode);
        } else if ((0, _isGQLOperation.isMutation)(gqlOperationText)) {
            validateOperationName(gqlOperationText, "Mutation", templateElementNode);
        }
    };
    // Handle GraphQL files directly
    const OperationDefinition = (node)=>{
        if (!isGraphQLFile) return;
        // For GraphQL files, we need to extract the operation from the document
        const sourceCode = context.getSourceCode();
        const fileContent = sourceCode.getText();
        // Find the operation type and name
        const queryMatch = fileContent.match(/query\s+(\w+)/);
        const mutationMatch = fileContent.match(/mutation\s+(\w+)/);
        if (queryMatch) {
            validateOperationName(queryMatch[0], "Query", node);
        } else if (mutationMatch) {
            validateOperationName(mutationMatch[0], "Mutation", node);
        }
    };
    return {
        TaggedTemplateExpression,
        OperationDefinition
    };
};
