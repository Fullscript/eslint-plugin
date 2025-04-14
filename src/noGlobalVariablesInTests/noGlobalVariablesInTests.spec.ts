import { ruleTester, createRule } from "../testUtils";
import { NO_GLOBAL_LET_IN_TESTS_ERROR_KEY, NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY } from "./messageIds";
import { create, meta } from "./noGlobalVariablesInTests";


const rule = createRule({
    name: "noGlobalVariablesInTests",
    defaultOptions: [],
    meta,
    create,
  });

  ruleTester.run("noGlobalVariablesInTests", rule, {
    valid: [{
        code:
            `
                describe("test", () => {
                let foo = 1;
                const bar = 2;
                const obj = { foo: 1 }
                ;)
            `,}],
    invalid: [
      {
        code:
            `
                import { render, screen } from "@testing/rtl";

                let foo = 1;
                describe("test", () => {
                it("should do something", () => {
                    expect(foo).toBe(1);
                });
                })
            `,
        errors: [{ messageId:NO_GLOBAL_LET_IN_TESTS_ERROR_KEY }],
      },
      {
        code:
            `
                import { render, screen } from "@testing/rtl";
                const foo = { bar: 1 };
                describe("test", () => {
                it("should do something", () => {
                    expect(foo).toEqual({ bar: 1 });
                });
            `,
        errors: [{messageId: NO_GLOBAL_OBJECT_IN_TESTS_ERROR_KEY}]
      }
    ],
  });
