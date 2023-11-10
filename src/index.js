import { circularDependency } from "./circularDependency";
import { crossReference } from "./crossReference";
import { gqlObjects, gqlOperationName, gqlVariableNameMatch } from "./gqlRules";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";
import { noUnawaitedSkeletons } from "./noUnawaitedSkeletons";
import { oneTranslationImport } from "./oneTranslationImport";
import { noJestInProduction } from "./noJestInProduction";
import { noCreateMockInSetFunctions } from "./noCreateMockInSetFunctions";

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
};

export { rules };
