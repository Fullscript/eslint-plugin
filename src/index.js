import { oneTranslationImport } from "./oneTranslationImport";
import { noRenamedTranslationImport } from "./noRenamedTranslationImport";

const rules = {
  "one-translation-import-per-file": oneTranslationImport,
  "no-renamed-translation-import": noRenamedTranslationImport,
};

export { rules };
