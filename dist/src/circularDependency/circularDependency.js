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
const meta = {
    type: "problem",
    docs: {
        description: "Prevents circular dependency",
        category: "circular-dependency",
        recommended: false
    },
    fixable: null,
    schema: []
};
const create = (context)=>{
    const filePath = context.getFilename().split("javascript/")[1]; // Example: "patient/components/RecentlyViewed/RecentlyViewed.tsx"
    const getPrettyImportPath = (val)=>{
        // Example: from "@patient/components/" to "patient/components"
        // The `\/$` part will match any / that is at the end of the string and replace it with an empty value
        return val.replace(/\/$/, "").replace("@", "");
    };
    const isNotSpec = ()=>{
        // Skip spec files
        return filePath && !filePath.includes(".spec.");
    };
    const isSameOrigin = (importPath)=>{
        // Both the file and import paths start from the same origin
        // Why? For example "app/javascript/aviary/components/Carousel/CarouselRadio/CarouselRadio.tsx"
        //   It should not fail because of importing "@aviary/components/Radio"
        //   Both the filePath and importPath are not starting from the same origin so no circular dependency here
        return filePath.startsWith(`${importPath}/`);
    };
    const isValid = (val)=>{
        const importPath = getPrettyImportPath(val);
        if (isNotSpec() && isSameOrigin(importPath)) return false;
        return true;
    };
    return {
        ImportDeclaration (node) {
            if (!isValid(node.source.value)) {
                context.report({
                    node,
                    message: `Imported module "${node.source.value}" breaks CircularDependency rule. Use deep import instead.`
                });
            }
        }
    };
};
