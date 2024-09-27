import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator(
  () => "https://github.com/pipopotamasu/eslint-plugin-no-implicit-any"
);

export { createRule };
