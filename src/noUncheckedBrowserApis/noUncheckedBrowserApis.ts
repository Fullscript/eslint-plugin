import { TSESTree } from "@typescript-eslint/utils";
import { RuleContext, RuleFixer } from "@typescript-eslint/utils/ts-eslint";
import { noUncheckedBrowserApisFixer } from "./noUncheckedBrowserApisFixer";
import {
  DISALLOWED_BROWSER_INTERFACES,
  BROWSER_INTERFACE_ABSTRACTIONS,
  ERROR_MESSAGE_IDS,
} from "./constants";
import { NamedCreateRuleMeta } from "@typescript-eslint/utils/eslint-utils";

const meta: NamedCreateRuleMeta<string, any[]> = {
  type: "problem",
  docs: {
    description:
      "Prevents invoking browser APIs without checking if running in a server environment",
  },
  fixable: "code",
  schema: [],
  messages: {
    [ERROR_MESSAGE_IDS.document]:
      "To prevent issues with Server Side Rendering, document can't be used directly. Please use getDocument instead.",
    [ERROR_MESSAGE_IDS.window]:
      "To prevent issues with Server Side Rendering, window can't be used directly. Please use getWindow instead.",
  },
};

const isBrowserApi = (identifierName: string): boolean => {
  return DISALLOWED_BROWSER_INTERFACES.includes(identifierName);
};

let programNode: TSESTree.Program | null;
let importAdded: boolean;

const create = (context: RuleContext<string, any[]>) => {
  programNode = null;
  importAdded = false;

  return {
    Program: (node: TSESTree.Program) => {
      programNode = node;
    },
    MemberExpression: (node: TSESTree.MemberExpression) => {
      if (
        node.object.type === TSESTree.AST_NODE_TYPES.Identifier &&
        isBrowserApi(node.object.name)
      ) {
        const browserApiIdentifierNode = node.object;
        const identifierName = browserApiIdentifierNode.name;

        context.report({
          node,
          messageId: ERROR_MESSAGE_IDS[identifierName],
          fix: (fixer: RuleFixer) => {
            const fix = noUncheckedBrowserApisFixer({
              fixer,
              programNode,
              browserApiIdentifierNode,
              moduleName: BROWSER_INTERFACE_ABSTRACTIONS[identifierName],
              importAdded,
            });
            importAdded = true;

            return fix;
          },
        });
      }
    },
  };
};

export { meta, create };
