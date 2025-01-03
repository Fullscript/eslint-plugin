import { circularDependency } from "./circularDependency";
import { crossReference } from "./crossReference";
import {
  gqlObjects,
  gqlOperationName,
  gqlVariableNameMatch,
  gqlNoManualHookDeclaration,
} from "./gqlRules";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";
import { noUnawaitedSkeletons } from "./noUnawaitedSkeletons";
import { oneTranslationImport } from "./oneTranslationImport";
import { noJestInProduction } from "./noJestInProduction";
import { noCreateMockInSetFunctions } from "./noCreateMockInSetFunctions";
import { noInvalidFeature } from "./noInvalidFeature";
import { aviaryNoClashingBoxColorProps } from "./aviaryRules";
import { noBannedTranslationWords } from "./noBannedTranslationWords";
import {noUnderScoreDangleAllowProductable} from "./noUnderScoreDangleAllowProductable";

const rules = {
  "one-translation-import-per-file": oneTranslationImport,
  "no-renamed-translation-import": noRenamedTranslationImport,
  "gql-objects": gqlObjects,
  "gql-operation-name": gqlOperationName,
  "gql-variable-name-match": gqlVariableNameMatch,
  "cross-reference": crossReference,
  "circular-dependency": circularDependency,
  "no-unawaited-skeletons": noUnawaitedSkeletons,
  "no-jest-in-production": noJestInProduction,
  "no-createMock-in-set-functions": noCreateMockInSetFunctions,
  "no-invalid-feature": noInvalidFeature,
  "gql-no-manual-hook-declaration": gqlNoManualHookDeclaration,
  "aviary-no-clashing-box-color-props": aviaryNoClashingBoxColorProps,
  "banned-translation-words": noBannedTranslationWords,
  "no-underscore-dangle-allow-productable": noUnderScoreDangleAllowProductable,
};

export { rules };
