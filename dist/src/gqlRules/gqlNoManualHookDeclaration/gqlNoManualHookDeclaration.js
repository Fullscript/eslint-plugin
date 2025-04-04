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
    create: function() {
        return create;
    },
    meta: function() {
        return meta;
    }
});
const _utils = require("../utils");
const _utils1 = require("../../utils");
const meta = {
    type: "problem",
    docs: {
        description: "Disallows hooks to be exported in the GQL source file. Encourages to use the generated hooks in query|mutation.generated.tsx",
        category: "gql-no-manual-hook-declaration",
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
const reactHookPrefix = new RegExp("^use\\w+");
const create = (context)=>{
    var _context_options_, _context_options;
    const isGqlObjectFile = (0, _utils.isGqlFile)(context);
    const ignoreList = (context === null || context === void 0 ? void 0 : (_context_options = context.options) === null || _context_options === void 0 ? void 0 : (_context_options_ = _context_options[0]) === null || _context_options_ === void 0 ? void 0 : _context_options_.namespaceIgnoreList) ?? [];
    const isInIgnoreList = ()=>{
        if (!(ignoreList === null || ignoreList === void 0 ? void 0 : ignoreList.length)) return false;
        const pathToFile = (0, _utils1.relativePathToFile)(context);
        return ignoreList.some((ignoredNamespace)=>pathToFile.startsWith(ignoredNamespace));
    };
    if (isInIgnoreList() || !isGqlObjectFile) return {}; // return early before going through nodes
    const isHookDeclaredManually = (node, name)=>{
        if (reactHookPrefix.test(name)) {
            context.report({
                node: node,
                message: `The hook "${name}" is manually exported from this file. Please use the hook from the corresponding query or mutation generated file located next to this file instead"`
            });
        }
    };
    const ExportNamedDeclaration = (node)=>{
        // no values in export statement
        if (node.exportKind !== "value") return;
        // When the variable is directly exported like so export const usePatientQuery =...
        if (node.declaration && node.declaration.declarations) {
            node.declaration.declarations.forEach((declaration)=>{
                isHookDeclaredManually(node, declaration.id.name);
            });
        } else {
            // When the variable is in the export statement like so export { usePatientQuery }
            node.specifiers.forEach(({ local })=>{
                isHookDeclaredManually(node, local.name);
            });
        }
    };
    return {
        ExportNamedDeclaration
    };
};
