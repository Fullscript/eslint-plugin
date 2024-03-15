import { load } from "js-yaml";
import { readFileSync } from "fs";

const meta = {
  type: "problem",
  docs: {
    description: "Disallows features in flipper.d.ts if they don't exist in features.yml",
    category: "no-invalid-feature",
    recommended: false,
  },
  fixable: null,
  schema: [
    {
      type: "object",
      properties: {
        staticFeaturesFilePath: {
          type: "string",
        },
      },
      required: ["staticFeaturesFilePath"],
      additionalProperties: false,
    },
  ],
};

const readFeatureYml = staticFeaturesFilePath => {
  return load(readFileSync(staticFeaturesFilePath, "utf8"));
};

/**
 * Looks through flipper.d.ts and ensures that all flippers listed appear in features.yml
 *
 * @param {import("@types/eslint").Rule.RuleContext} context
 * @returns {import("@typescript-eslint/utils/dist/index").ESLintUtils.RuleListener}
 */
const create = context => {
  if (!context.getFilename().endsWith("flipper.d.ts")) return {};

  const { staticFeaturesFilePath } = context.options[0];
  let validFeatures;

  readFeatureYml(staticFeaturesFilePath);

  return {
    Program: () => {
      validFeatures = readFeatureYml(staticFeaturesFilePath);
    },
    TSLiteralType: node => {
      const featureName = node?.literal?.value;

      if (featureName && !validFeatures[node.literal.value]) {
        context.report({
          node: node,
          message: `${featureName} isn't a valid feature name, please verify that the feature exists in: '${staticFeaturesFilePath}'.`,
        });
      }
    },
  };
};

export { meta, create };
