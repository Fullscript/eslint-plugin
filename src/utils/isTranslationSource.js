const TRANSLATION_IMPORT_SUFFIXES = ["/locales", "/locales/i18n", "/locales/", "/locales/i18n/"];

const isTranslationSource = source => {
  if (!source) return false;

  return TRANSLATION_IMPORT_SUFFIXES.some(suffix => {
    return source.value.endsWith(suffix);
  });
};

export { isTranslationSource };
