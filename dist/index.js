"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "rules", {
    enumerable: true,
    get: ()=>rules
});
const _circularDependency = require("./circularDependency");
const _crossReference = require("./crossReference");
const _gqlRules = require("./gqlRules");
const _noRenamedTranslationImport = require("./noRenamedTranslationImport");
const _noUnawaitedSkeletons = require("./noUnawaitedSkeletons");
const _oneTranslationImport = require("./oneTranslationImport");
const _noJestInProduction = require("./noJestInProduction");
const rules = {
    "one-translation-import-per-file": _oneTranslationImport.oneTranslationImport,
    "no-renamed-translation-import": _noRenamedTranslationImport.noRenamedTranslationImport,
    "gql-objects": _gqlRules.gqlObjects,
    "gql-operation-name": _gqlRules.gqlOperationName,
    "cross-reference": _crossReference.crossReference,
    "circular-dependency": _circularDependency.circularDependency,
    "no-unawaited-skeletons": _noUnawaitedSkeletons.noUnawaitedSkeletons,
    "no-jest-in-production": _noJestInProduction.noJestInProduction
};
