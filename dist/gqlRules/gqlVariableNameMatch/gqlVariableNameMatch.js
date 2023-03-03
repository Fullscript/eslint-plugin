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
        description: "The variable name to which a GQL template literal is assigned should match the GQL operation name Ex: const Patient_Query_UserAvatar = gql` query Patient_Query_UserAvatar...`",
        category: "gql-variable-name-match",
        recommended: false
    },
    fixable: null,
    schema: [
        {
            type: "object",
            properties: {
                namespaceIgnoreList: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                }
            },
            additionalProperties: false
        }
    ]
};
const create = (context)=>{
    const isGqlObjectFile = (0, _utils.isGqlFile)(context);
    const { namespaceIgnoreList  } = context.options[0];
    const isGqlTemplateElement = (node)=>{
        return node.tag && node.tag.name === "gql";
    };
    const isInIgnoreList = ()=>{
        const pathToFile = (0, _utils1.relativePathToFile)(context);
        return namespaceIgnoreList.some((ignoredNamespace)=>pathToFile.startsWith(ignoredNamespace));
    };
    const isOperationNameAndVariableNameSame = (gqlOperationText, node)=>{
        const operationType = (0, _isGQLOperation.isQuery)(gqlOperationText) ? "Query" : "Mutation";
        const gqlOperationName = (0, _operationName.operationName)(gqlOperationText, operationType);
        const { id  } = node;
        const variableName = id.name;
        if (isInIgnoreList()) {
            return;
        }
        const isOperationNameValid = !!gqlOperationName.match(variableName);
        if (!isOperationNameValid) {
            context.report({
                node: node,
                message: `The variable name "${variableName}" should match with the GQL operation name, please use "${gqlOperationName}"`
            });
        }
    };
    const VariableDeclarator = (node)=>{
        if (!isGqlObjectFile || !isGqlTemplateElement(node.init)) return;
        const { init  } = node;
        const templateElementNode = init.quasi;
        const gqlOperationText = (0, _sanitizeGqlOperationText.sanitizeGqlOperationText)(templateElementNode, context);
        isOperationNameAndVariableNameSame(gqlOperationText, node);
    };
    return {
        VariableDeclarator
    };
};
