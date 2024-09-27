import { isTranslationSource } from "../utils";

const DUPLICATED_IMPORT_ERROR_KEY = "duplicatedImport";

const meta = {
  type: "problem" as const,
  docs: {
    description: "Enforces that there's just one translation import per file",
    category: "translation-import",
  },
  fixable: null,
  schema: [],
  messages: {
    [DUPLICATED_IMPORT_ERROR_KEY]:
      "There's already a translation import in this file, only one import per file is allowed.",
  },
};

const create = context => {
  const translationImportNodes = [];

  return {
    ImportDeclaration: node => {
      const { source } = node;

      if (isTranslationSource(source)) {
        if (translationImportNodes.length === 0) {
          translationImportNodes.push(node);
        } else {
          context.report({
            node: node,
            messageId: DUPLICATED_IMPORT_ERROR_KEY,
          });
        }
      }
    },
  };
};

export { meta, create, DUPLICATED_IMPORT_ERROR_KEY };
