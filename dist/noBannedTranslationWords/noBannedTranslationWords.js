"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    meta: ()=>meta,
    isEmpty: ()=>isEmpty,
    buildErrorMessage: ()=>buildErrorMessage,
    searchForBannedWords: ()=>searchForBannedWords,
    isTranslationFile: ()=>isTranslationFile,
    create: ()=>create
});
const _escapeString = require("../utils/escapeString");
const meta = {
    type: "problem",
    docs: {
        description: "Prevents banned words from being used in translations",
        category: "banned-translation-words",
        recommended: false
    },
    fixable: null
};
const isEmpty = (arr)=>Array.isArray(arr) && arr.length === 0;
const buildErrorMessage = (word)=>`Word \`${word}\` is not allowed to be used directly in translations.`;
const searchForBannedWords = (bannedWords, value)=>{
    return bannedWords.reduce((acc, word)=>{
        const pattern = new RegExp('\\b' + (0, _escapeString.escapeString)(word) + '\\b', 'i');
        if (pattern.test(value)) {
            const match = value.match(pattern);
            if (match) {
                acc.push(match[0]);
            }
        }
        return acc;
    }, []);
};
const isTranslationFile = (context)=>{
    var _context_options;
    const { directories =[] , extensions =[]  } = ((_context_options = context.options) === null || _context_options === void 0 ? void 0 : _context_options[0]) || {};
    const filename = context.getFilename();
    const translationDirectories = directories.join("|");
    const translationExtensions = extensions.join("|");
    const translationFileRegex = new RegExp(`(${translationDirectories})/.*(${translationExtensions})$`);
    if (!filename) return false;
    return !!filename.match(translationFileRegex);
};
const create = (context)=>{
    var _context_options;
    if (!isTranslationFile(context)) {
        return {};
    }
    const { bannedWords =[]  } = ((_context_options = context.options) === null || _context_options === void 0 ? void 0 : _context_options[0]) || {};
    return {
        Literal (node) {
            if (typeof node.value !== 'string') return;
            const result = searchForBannedWords(bannedWords, node.value);
            if (!isEmpty(result)) {
                context.report({
                    node,
                    message: buildErrorMessage(result[0].trim())
                });
            } else {
                return;
            }
        }
    };
};
