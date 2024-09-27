import { escapeString } from "../utils/escapeString";

export const meta = {
  type: "problem",
  docs: {
    description: "Prevents banned words from being used in translations",
    category: "banned-translation-words",
    recommended: false,
  },
  fixable: null,
};

export const isEmpty = (arr: string[]): boolean => Array.isArray(arr) && arr.length === 0;

export const buildErrorMessage = (word: string): string =>
  `Word \`${word}\` is not allowed to be used directly in translations.`;

export const searchForBannedWords = (bannedWords: Array<string>, value: string): string[] => {
  return bannedWords.reduce((acc: string[], word: string) => {
    const pattern = new RegExp("\\b" + escapeString(word) + "\\b", "i");
    if (pattern.test(value)) {
      const match = value.match(pattern);
      if (match) {
        acc.push(match[0]);
      }
    }
    return acc;
  }, []);
};

export const isTranslationFile = context => {
  const { directories = [], extensions = [] } = context.options?.[0] || {};
  const filename = context.getFilename();
  const translationDirectories = directories.join("|");
  const translationExtensions = extensions.join("|");
  const translationFileRegex = new RegExp(
    `(${translationDirectories})/.*(${translationExtensions})$`
  );

  if (!filename) return false;

  return !!filename.match(translationFileRegex);
};

export const create = context => {
  if (!isTranslationFile(context)) {
    return {};
  }

  const { bannedWords = [] } = context.options?.[0] || {};

  return {
    Literal(node) {
      if (typeof node.value !== "string") return;
      if (node.parent.type !== "Property") return;

      const result = searchForBannedWords(bannedWords, node.value);

      if (!isEmpty(result)) {
        context.report({
          node,
          message: buildErrorMessage(result[0].trim()),
        });
      } else {
        return;
      }
    },
  };
};
