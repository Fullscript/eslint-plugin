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
const _noCreateMockInSetFunctions = require("./noCreateMockInSetFunctions");
const _noInvalidFeature = require("./noInvalidFeature");
const _aviaryRules = require("./aviaryRules");
const _noBannedTranslationWords = require("./noBannedTranslationWords");
const rules = {
    "one-translation-import-per-file": _oneTranslationImport.oneTranslationImport,
    "no-renamed-translation-import": _noRenamedTranslationImport.noRenamedTranslationImport,
    "gql-objects": _gqlRules.gqlObjects,
    "gql-operation-name": _gqlRules.gqlOperationName,
    "gql-variable-name-match": _gqlRules.gqlVariableNameMatch,
    "cross-reference": _crossReference.crossReference,
    "circular-dependency": _circularDependency.circularDependency,
    "no-unawaited-skeletons": _noUnawaitedSkeletons.noUnawaitedSkeletons,
    "no-jest-in-production": _noJestInProduction.noJestInProduction,
    "no-createMock-in-set-functions": _noCreateMockInSetFunctions.noCreateMockInSetFunctions,
    "no-invalid-feature": _noInvalidFeature.noInvalidFeature,
    "gql-no-manual-hook-declaration": _gqlRules.gqlNoManualHookDeclaration,
    "aviary-no-clashing-box-color-props": _aviaryRules.aviaryNoClashingBoxColorProps,
    "banned-translation-words": _noBannedTranslationWords.noBannedTranslationWords
};
