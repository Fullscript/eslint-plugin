import { oneTranslationImport } from "./oneTranslationImport";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";
import { gqlObjects, gqlOperationName } from "./gqlRules";
import { crossReference } from "./crossReference";

const rules = {
  "one-translation-import-per-file": oneTranslationImport,
  "no-renamed-translation-import": noRenamedTranslationImport,
  "gql-objects": gqlObjects,
  "gql-operation-name": gqlOperationName,
  "cross-reference": crossReference,
};

export { rules };
