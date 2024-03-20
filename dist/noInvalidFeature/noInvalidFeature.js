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
const _jsYaml = require("js-yaml");
const _fs = require("fs");
const meta = {
    type: "problem",
    docs: {
        description: "Disallows features in flipper.d.ts if they don't exist in features.yml",
        category: "no-invalid-feature",
        recommended: false
    },
    fixable: null,
    schema: [
        {
            type: "object",
            properties: {
                staticFeaturesFilePath: {
                    type: "string"
                }
            },
            required: [
                "staticFeaturesFilePath"
            ],
            additionalProperties: false
        }
    ]
};
const readFeatureYml = (staticFeaturesFilePath)=>{
    return (0, _jsYaml.load)((0, _fs.readFileSync)(staticFeaturesFilePath, "utf8"));
};
/**
 * Looks through flipper.d.ts and ensures that all flippers listed appear in features.yml
 *
 * @param {import("@types/eslint").Rule.RuleContext} context
 * @returns {import("@typescript-eslint/utils/dist/index").ESLintUtils.RuleListener}
 */ const create = (context)=>{
    if (!context.getFilename().endsWith("flipper.d.ts")) return {};
    const { staticFeaturesFilePath  } = context.options[0];
    let validFeatures;
    readFeatureYml(staticFeaturesFilePath);
    return {
        Program: ()=>{
            validFeatures = readFeatureYml(staticFeaturesFilePath);
        },
        TSLiteralType: (node)=>{
            var _node_literal;
            const featureName = node === null || node === void 0 ? void 0 : (_node_literal = node.literal) === null || _node_literal === void 0 ? void 0 : _node_literal.value;
            if (featureName && !validFeatures[node.literal.value]) {
                context.report({
                    node: node,
                    message: `${featureName} isn't a valid feature name, please verify that the feature exists in: '${staticFeaturesFilePath}'.`
                });
            }
        }
    };
};
