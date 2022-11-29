import { oneTranslationImport } from "./oneTranslationImport";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";
import { gqlObjects, gqlOperationName } from "./gqlRules";

const rules = {
  "one-translation-import-per-file": oneTranslationImport,
  "no-renamed-translation-import": noRenamedTranslationImport,
  "gql-objects": gqlObjects,
  "gql-operation-name": gqlOperationName,
};

export { rules };
