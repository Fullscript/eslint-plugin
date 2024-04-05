import { isTranslationSource } from "../utils";

const meta = {
  type: "problem",
  docs: {
    description: "Enforces that there's just one translation import per file",
    category: "translation-import",
    recommended: false,
  },
  fixable: null,
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
            message:
              "There's already a translation import in this file, only one import per file is allowed.",
          });
        }
      }
    },
  };
};

export { meta, create };
