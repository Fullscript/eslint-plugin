"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rules", {
    enumerable: true,
    get: ()=>rules
});
const _oneTranslationImport = require("./oneTranslationImport");
const _noRenamedTranslationImport = require("./noRenamedTranslationImport");
const _gqlRules = require("./gqlRules");
const _crossReference = require("./crossReference");
const rules = {
    "one-translation-import-per-file": _oneTranslationImport.oneTranslationImport,
    "no-renamed-translation-import": _noRenamedTranslationImport.noRenamedTranslationImport,
    "gql-objects": _gqlRules.gqlObjects,
    "gql-operation-name": _gqlRules.gqlOperationName,
    "cross-reference": _crossReference.crossReference
};
