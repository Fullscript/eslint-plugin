import { autoExportObject } from "./autoExport";

describe("autoExport", () => {
  let fixer;
  let replaceText;
  let insertTextAfter;

  beforeEach(() => {
    replaceText = jest.fn((_, newText) => {
      return newText;
    });

    insertTextAfter = jest.fn((_, newText) => {
      return newText;
    });

    fixer = {
      replaceText,
      insertTextAfter,
    };
  });

  describe("autoExportObject", () => {
    describe("when an export statement exists", () => {
      it("appends nodeName to the end of the export statement", () => {
        const sourceCode = () => {
          return {
            getText: () => "export { useUserQuery };",
          };
        };
        const context = { getSourceCode: sourceCode };
        const exports = [{}];
        const nodeName = "USER_QUERY";
        const output = autoExportObject(fixer, context, null, exports, nodeName);
        expect(output).toEqual("export { useUserQuery, USER_QUERY };");
      });

      it("appends to an existing multiline export statement", () => {
        const sourceCode = () => {
          return {
            getText: () => {
              return `export {\n  useSomeQuery,\n};`;
            },
          };
        };

        const context = { getSourceCode: sourceCode };
        const exports = [{}];
        const nodeName = "SOME_QUERY";
        const output = autoExportObject(fixer, context, null, exports, nodeName);
        expect(output).toEqual(`export {\n  useSomeQuery,\n  SOME_QUERY,\n};`);
      });

      it("adds a new export statement if one does not exist", () => {
        const sourceCode = () => {
          return {
            getLastToken: () => {},
          };
        };
        const context = { getSourceCode: sourceCode };
        const exports = [];
        const nodeName = "useSomeQuery";
        const output = autoExportObject(fixer, context, null, exports, nodeName);
        expect(output).toEqual(`\n\nexport { useSomeQuery };`);
      });
    });
  });
});
