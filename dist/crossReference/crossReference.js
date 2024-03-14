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
    create: ()=>create
});
const _nodePath = /*#__PURE__*/ _interopRequireDefault(require("node:path"));
const _getModules = require("./getModules");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const meta = {
    type: "problem",
    docs: {
        description: "Prevent imports across applications",
        category: "no-cross-imports",
        recommended: false
    },
    fixable: null,
    schema: [
        {
            type: "object",
            properties: {
                absoluteAppPath: {
                    type: "string"
                },
                relativeAppPath: {
                    type: "string"
                },
                crossReferenceConfig: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            directory: {
                                type: "string"
                            },
                            sharedModules: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            },
                            allowlistDirectories: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            }
                        },
                        required: [
                            "directory",
                            "sharedModules",
                            "allowlistDirectories"
                        ]
                    }
                }
            },
            required: [
                "absoluteAppPath",
                "relativeAppPath",
                "crossReferenceConfig"
            ],
            additionalProperties: false
        }
    ]
};
const create = (context)=>{
    const { relativeAppPath , absoluteAppPath , crossReferenceConfig  } = context.options[0];
    const crossReferenceConfigWithModules = crossReferenceConfig.map((configEntry)=>{
        configEntry["modules"] = (0, _getModules.getModules)(absoluteAppPath, configEntry.directory);
        return configEntry;
    });
    const getModule = (filePath, { directory  })=>{
        const basePath = _nodePath.default.join(relativeAppPath, directory);
        const jsIndex = filePath.indexOf(basePath);
        if (jsIndex === -1) {
            return null;
        }
        const name = filePath.substring(jsIndex).replace(relativeAppPath, "").replace(directory, "").split("/").filter((val)=>val)[0];
        return _nodePath.default.join(directory, name);
    };
    const getImportModule = (importPath, config)=>{
        const jsModule = getModule(importPath, config);
        if (jsModule) {
            return jsModule;
        }
        // Checks to see if the import path is a namespace within the application or an external node module
        const isImportPathAnAppNamespace = config.modules.find((moduleName)=>moduleName.startsWith(importPath.split("/")[0]));
        return isImportPathAnAppNamespace && (config.modules.find((moduleName)=>importPath.startsWith(`${moduleName}/`)) || config.modules.find((moduleName)=>importPath.startsWith(moduleName)));
    };
    const isValidConfig = (node, config)=>{
        debugger;
        const fileModule = getModule(context.getFilename(), config);
        if (!fileModule) return true;
        const whitelisted = config.allowlistDirectories.includes(fileModule);
        if (whitelisted) return true;
        const importModule = getImportModule(node.source.value, config);
        if (!importModule) return true;
        const shared = config.sharedModules.includes(importModule);
        if (shared) return true;
        if (importModule === fileModule || importModule === `@${fileModule}`) return true;
        return false;
    };
    const isValid = (node)=>{
        return crossReferenceConfigWithModules.every((config)=>isValidConfig(node, config));
    };
    return {
        ImportDeclaration (node) {
            if (!isValid(node)) {
                context.report({
                    node,
                    message: `Imported module ${node.source.value} breaks crossReference rule`
                });
            }
        }
    };
};
