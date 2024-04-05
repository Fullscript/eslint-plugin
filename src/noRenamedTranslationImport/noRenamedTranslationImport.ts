import { isTranslationSource } from "../utils";
import { hasRenamedLSpecifier } from "./hasRenamedLSpecifier";

const meta = {
  type: "problem",
  docs: {
    description: "Disallows l objects from locale imports from being renamed",
    category: "translation-import",
    recommended: false,
  },
  fixable: null,
};

const create = context => {
  return {
    ImportDeclaration: node => {
      const { source, specifiers } = node;

      if (isTranslationSource(source) && hasRenamedLSpecifier(specifiers)) {
        context.report({
          node: node,
          message: "Can't rename l modules from translation imports",
        });
      }
    },
  };
};

export { meta, create };
