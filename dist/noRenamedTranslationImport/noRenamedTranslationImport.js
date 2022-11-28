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
const _hasRenamedLSpecifier = require("./hasRenamedLSpecifier");
const meta = {
    type: "problem",
    docs: {
        description: "Disallows l objects from locale imports from being renamed",
        category: "translation-import",
        recommended: false
    },
    fixable: null
};
const create = (context)=>{
    return {
        ImportDeclaration: (node)=>{
            const { source , specifiers  } = node;
            if ((0, _utils.isTranslationSource)(source) && (0, _hasRenamedLSpecifier.hasRenamedLSpecifier)(specifiers)) {
                context.report({
                    node: node,
                    message: "Can't rename l modules from translation imports"
                });
            }
        }
    };
};
