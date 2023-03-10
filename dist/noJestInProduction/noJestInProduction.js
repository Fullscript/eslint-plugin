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
const meta = {
    type: "problem",
    docs: {
        description: "Prevents jest from being used in production code",
        category: "no-jest-in-production",
        recommended: false
    },
    fixable: null,
    schema: []
};
const create = (context)=>{
    // split the filepath into an array
    const filePath = context.getFilename().split("/");
    // the last entry will always be the file name
    const fileName = filePath.at(-1);
    // Spec files are allowed to have jest, so we skip them
    const isNotSpec = ()=>{
        return fileName && !fileName.includes(".spec.");
    };
    const isNotValid = (node)=>{
        return isNotSpec() && node.name === "jest";
    };
    return {
        Identifier (node) {
            if (isNotValid(node)) {
                context.report({
                    node,
                    message: "Jest should not be used in production code"
                });
            }
        }
    };
};
