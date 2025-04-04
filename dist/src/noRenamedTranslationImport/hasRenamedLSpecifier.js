"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasRenamedLSpecifier", {
    enumerable: true,
    get: function() {
        return hasRenamedLSpecifier;
    }
});
const hasRenamedLSpecifier = (specifiers)=>{
    return specifiers === null || specifiers === void 0 ? void 0 : specifiers.some((specifier)=>{
        return specifier.imported.name === "l" && specifier.local.name !== "l";
    });
};
