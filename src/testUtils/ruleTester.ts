import { RuleTester } from "@typescript-eslint/rule-tester";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  defaultFilenames: {
    ts: "src/index.ts",
    tsx: "",
  },
});

export { ruleTester };
