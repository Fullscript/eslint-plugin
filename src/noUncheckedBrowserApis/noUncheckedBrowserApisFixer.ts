import { TSESTree } from "@typescript-eslint/utils";
import { RuleFix, RuleFixer } from "@typescript-eslint/utils/ts-eslint";

interface noUncheckedBrowserApisFixerParams {
  fixer: RuleFixer;
  programNode: TSESTree.Program;
  browserApiIdentifierNode: TSESTree.Identifier;
  moduleName: string;
  importAdded: boolean;
}

type ReplaceBrowserApisWithModuleParams = Pick<
  noUncheckedBrowserApisFixerParams,
  "fixer" | "browserApiIdentifierNode" | "moduleName"
>;

type AddNewImportParams = Pick<
  noUncheckedBrowserApisFixerParams,
  "fixer" | "programNode" | "moduleName" | "importAdded"
>;

const replaceBrowserApiWithModule = ({
  fixer,
  browserApiIdentifierNode,
  moduleName,
}: ReplaceBrowserApisWithModuleParams): RuleFix => {
  return fixer.replaceText(browserApiIdentifierNode, `${moduleName}()?`);
};

const addNewImport = ({
  fixer,
  programNode,
  moduleName,
  importAdded,
}: AddNewImportParams): RuleFix => {
  if (importAdded) return null;

  return fixer.insertTextBefore(
    programNode,
    `import { ${moduleName} } from "@shared/utils/${moduleName}/${moduleName}";\n`
  );
};

const noUncheckedBrowserApisFixer = ({
  fixer,
  programNode,
  browserApiIdentifierNode,
  moduleName,
  importAdded,
}: noUncheckedBrowserApisFixerParams): RuleFix[] => {
  const moduleAbstractionFix = replaceBrowserApiWithModule({
    fixer,
    browserApiIdentifierNode,
    moduleName,
  });

  const importFix = addNewImport({ fixer, programNode, moduleName, importAdded });

  return [moduleAbstractionFix, importFix].filter(Boolean);
};

export { noUncheckedBrowserApisFixer };
