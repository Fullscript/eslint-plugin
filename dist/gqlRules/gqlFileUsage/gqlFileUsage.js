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
const _path = /*#__PURE__*/ _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const NO_GRAPHQL_TSX_FILES_MSG = "noGraphqlTsxFiles";
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
                baseBranch: {
                    type: "string",
                    description: "Base branch to compare against (default: 'staging')",
                    default: "staging"
                },
                developmentMode: {
                    type: "boolean",
                    description: "Indicate rule is running in IDE developement, not CI or command line check",
                    default: undefined
                },
                fileTargetting: {
                    type: "string",
                    description: "Determine level of file targeting for incremental adoption (values: 'all', 'new', 'modified')",
                    default: 'all'
                }
            },
            additionalProperties: false
        }
    ],
    messages: {
        [NO_GRAPHQL_TSX_FILES_MSG]: "Use \"{{ operationName }}.{{ operationType }}.gql\" file instead. The team is moving away from .tsx/.ts operation files.\nIf you encounter any issues with the .gql generated types, please notify #eng-hopper\nMigration guide: https://docs.google.com/document/d/1s2qpdvmjevOUt7SgJA1RqWElk2S4XMrloVKEeYPvLfI"
    }
};
const create = (context)=>{
    var _context_options, _context_getSourceCode_lines_;
    const fileName = context.getFilename();
    const match = fileName.match(/\.(query|mutation|fragment)\.tsx?$/);
    if (!match) {
        return {};
    }
    const options = (context === null || context === void 0 ? void 0 : (_context_options = context.options) === null || _context_options === void 0 ? void 0 : _context_options[0]) || {};
    const ignoreList = (options === null || options === void 0 ? void 0 : options.namespaceIgnoreList) ?? [];
    const baseBranch = (options === null || options === void 0 ? void 0 : options.baseBranch) || 'staging';
    const fileTargetting = (options === null || options === void 0 ? void 0 : options.fileTargetting) ?? 'all';
    const developmentMode = options === null || options === void 0 ? void 0 : options.developmentMode;
    const isInIgnoreList = ()=>{
        if (!(ignoreList === null || ignoreList === void 0 ? void 0 : ignoreList.length)) return false;
        const pathToFile = (0, _utils.relativePathToFile)(context);
        return ignoreList.some((ignoredNamespace)=>pathToFile.startsWith(ignoredNamespace));
    };
    if (isInIgnoreList()) {
        return {};
    }
    // Check if this file should be linted based on git diff
    if (!(0, _utils.shouldFileBeLinted)(fileTargetting, fileName, baseBranch, developmentMode)) {
        return {};
    }
    // Extract the type (query, mutation, fragment) from the match
    const operationType = match[1];
    const fileNameOnly = _path.default.basename(fileName);
    const operationName = fileNameOnly.replace(/\.(query|mutation|fragment)\.tsx?$/, '');
    // Report the violation
    context.report({
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: ((_context_getSourceCode_lines_ = context.getSourceCode().lines[0]) === null || _context_getSourceCode_lines_ === void 0 ? void 0 : _context_getSourceCode_lines_.length) || 0
            }
        },
        messageId: NO_GRAPHQL_TSX_FILES_MSG,
        data: {
            operationType,
            operationName
        }
    });
    return {};
};
