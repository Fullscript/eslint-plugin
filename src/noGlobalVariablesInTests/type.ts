import type { TSESLint } from "@typescript-eslint/utils";
import { NO_GLOBAL_LET_IN_TESTS_ERROR_KEY, NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY } from "./messageIds";

export type NoGlobalVariablesInTestsContext = Readonly<
  TSESLint.RuleContext<
    typeof NO_GLOBAL_LET_IN_TESTS_ERROR_KEY | typeof NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY,
    any[]
  >
>;
