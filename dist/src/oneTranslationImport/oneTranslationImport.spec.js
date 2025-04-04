"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _oneTranslationImport = require("./oneTranslationImport");
const _testUtils = require("../testUtils");
const rule = (0, _testUtils.createRule)({
    name: "oneTranslationImport",
    defaultOptions: [],
    meta: _oneTranslationImport.meta,
    create: _oneTranslationImport.create
});
_testUtils.ruleTester.run("oneTranslationImport", rule, {
    valid: [
        'import { i18n } from "@shared/locales";'
    ],
    invalid: [
        {
            code: `
                import { i18n } from "@shared/locales";
                import { i18n as dup } from "@shared/locales/i18n";
            `,
            errors: [
                {
                    messageId: _oneTranslationImport.DUPLICATED_IMPORT_ERROR_KEY
                }
            ]
        }
    ]
});
