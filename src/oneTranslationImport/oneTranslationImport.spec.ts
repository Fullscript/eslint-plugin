import { create, meta, DUPLICATED_IMPORT_ERROR_KEY } from "./oneTranslationImport";
import { ruleTester, createRule } from "../testUtils";

const rule = createRule({
  name: "oneTranslationImport",
  defaultOptions: [],
  meta,
  create,
});

ruleTester.run("oneTranslationImport", rule, {
  valid: ['import { i18n } from "@shared/locales";'],
  invalid: [
    {
      code: `
                import { i18n } from "@shared/locales";
                import { i18n as dup } from "@shared/locales/i18n";
            `,
      errors: [{ messageId: DUPLICATED_IMPORT_ERROR_KEY }],
    },
  ],
});
