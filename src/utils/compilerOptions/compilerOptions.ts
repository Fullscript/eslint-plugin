import { ESLintUtils } from "@typescript-eslint/utils";
import type { TSESLint } from "@typescript-eslint/utils";

export const enabledStrictNullChecks = <T extends string>(
  context: Readonly<TSESLint.RuleContext<T, any[]>>
) => {
  const parserServices = ESLintUtils.getParserServices(context);
  const compilerOptions = parserServices.program.getCompilerOptions();

  const { strictNullChecks, strict } = compilerOptions;
  if (strictNullChecks) return true;
  if (strictNullChecks === undefined && strict) return true;
  return false;
};
