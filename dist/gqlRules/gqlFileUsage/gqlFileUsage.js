/**
 * @fileoverview Rule to disallow new GraphQL TypeScript files in favor of .gql files
 * @author Matthew Young
 */ "use strict";
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
    create: ()=>create
});
const _utils = require("../../utils");
const _childProcess = require("child_process");
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const meta = {
    type: "problem",
    docs: {
        description: "Disallow new .query.ts*, .mutation.ts*, and .fragment.ts* files in favor of .gql files",
        category: "GraphQL",
        recommended: true
    },
    schema: [
        {
            type: "object",
            properties: {
                namespaceIgnoreList: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                migrationStartDate: {
                    type: "string",
                    description: "Date when migration started (YYYY-MM-DD). Files existing before this date will be exempted."
                }
            },
            additionalProperties: false
        }
    ],
    messages: {
        noGraphqlTsxFiles: "Use \"{{ operationName }}.{{ operationType }}.gql\" file instead. The team is moving away from .tsx/.ts operation files.\nIf you encounter any issues with the .gql generated types, please notify #eng-hopper\nMore Info: https://docs.google.com/document/d/1s2qpdvmjevOUt7SgJA1RqWElk2S4XMrloVKEeYPvLfI"
    }
};
const create = (context)=>{
    var _context_options;
    const fileName = context.getFilename();
    const match = fileName.match(/\.(query|mutation|fragment)\.tsx?$/);
    if (!match) {
        return {};
    }
    const options = (context === null || context === void 0 ? void 0 : (_context_options = context.options) === null || _context_options === void 0 ? void 0 : _context_options[0]) || {};
    const ignoreList = (options === null || options === void 0 ? void 0 : options.namespaceIgnoreList) ?? [];
    const migrationStartDate = options === null || options === void 0 ? void 0 : options.migrationStartDate;
    const isInIgnoreList = ()=>{
        if (!(ignoreList === null || ignoreList === void 0 ? void 0 : ignoreList.length)) return false;
        const pathToFile = (0, _utils.relativePathToFile)(context);
        return ignoreList.some((ignoredNamespace)=>pathToFile.startsWith(ignoredNamespace));
    };
    if (isInIgnoreList()) {
        return {};
    }
    // Check if file existed before migration start date
    const isExistingFile = ()=>{
        if (!migrationStartDate) {
            return false; // If no migration date set, treat all files as new
        }
        try {
            // Check if file existed before the migration start date
            const result = (0, _childProcess.execSync)(`git log --oneline --before="${migrationStartDate}" -- "${fileName}"`, {
                encoding: 'utf8',
                stdio: 'pipe',
                cwd: process.cwd()
            });
            const hasHistoryBeforeMigration = result.trim().length > 0;
            return hasHistoryBeforeMigration;
        } catch (error) {
            // If git command fails, assume it's a new file
            return false;
        }
    };
    // If file existed before migration start, exempt it
    if (isExistingFile()) {
        return {};
    }
    // Extract the type (query, mutation, fragment) from the match
    const operationType = match[1];
    const extension = fileName.endsWith("x") ? ".tsx" : ".ts";
    const fileType = `.${operationType}${extension}`;
    const fileNameOnly = _path.default.basename(fileName);
    const operationName = fileNameOnly.replace(/\.(query|mutation|fragment)\.tsx?$/, '');
    // Report the violation
    context.report({
        loc: {
            line: 1,
            column: 0
        },
        messageId: "noGraphqlTsxFiles",
        data: {
            operationType,
            operationName,
            fileType
        }
    });
    return {};
};
