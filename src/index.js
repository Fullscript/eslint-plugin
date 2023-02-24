import { circularDependency } from "./circularDependency";
import { crossReference } from "./crossReference";
import { gqlObjects, gqlOperationName, gqlNameMatch } from "./gqlRules";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";
import { noUnawaitedSkeletons } from "./noUnawaitedSkeletons";
import { oneTranslationImport } from "./oneTranslationImport";
import { noJestInProduction } from "./noJestInProduction";

const rules = {
  "one-translation-import-per-file": oneTranslationImport,
  "no-renamed-translation-import": noRenamedTranslationImport,
  "gql-objects": gqlObjects,
  "gql-operation-name": gqlOperationName,
  "gql-name-match": gqlNameMatch,
  "cross-reference": crossReference,
  "circular-dependency": circularDependency,
  "no-unawaited-skeletons": noUnawaitedSkeletons,
  "no-jest-in-production": noJestInProduction,
};

export { rules };
