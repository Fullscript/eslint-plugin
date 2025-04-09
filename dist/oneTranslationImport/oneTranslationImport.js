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
const meta = {
    type: "problem",
    docs: {
        description: "Enforces that there's just one translation import per file",
        category: "translation-import",
        recommended: false
    },
    fixable: null
};
const create = (context)=>{
    const translationImportNodes = [];
    return {
        ImportDeclaration: (node)=>{
            const { source  } = node;
            if ((0, _utils.isTranslationSource)(source)) {
                if (translationImportNodes.length === 0) {
                    translationImportNodes.push(node);
                } else {
                    context.report({
                        node: node,
                        message: "There's already a translation import in this file, only one import per file is allowed."
                    });
                }
            }
        }
    };
};
