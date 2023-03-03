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
                }
            },
            required: [
                "namespaceOperationPrefix"
            ],
            additionalProperties: false
        }
    ]
};
const create = (context)=>{
    const isGqlObjectFile = (0, _utils.isGqlFile)(context);
    const { namespaceOperationPrefix , namespaceIgnoreList  } = context.options[0];
    const isGqlTemplateElement = (node)=>{
        return node.tag && node.tag.name === "gql";
    };
    const getNamespaceAndPrefix = ()=>{
        const pathToFile = (0, _utils1.relativePathToFile)(context);
        const relativeJsPath = pathToFile.replace("app/javascript/", "");
        const namespace = Object.keys(namespaceOperationPrefix).find((namespaceOperationKey)=>relativeJsPath.startsWith(namespaceOperationKey));
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
    const TaggedTemplateExpression = (node)=>{
        if (!isGqlObjectFile || !isGqlTemplateElement(node)) return;
        const templateElementNode = node.quasi;
        const gqlOperationText = (0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(templateElementNode, context);
        if ((0, _isGQLOperation.isQuery)(gqlOperationText)) {
            validateOperationName(gqlOperationText, "Query", templateElementNode);
        } else if ((0, _isGQLOperation.isMutation)(gqlOperationText)) {
            validateOperationName(gqlOperationText, "Mutation", templateElementNode);
        }
    };
    return {
        TaggedTemplateExpression
    };
};
