import { isGqlFile } from "../utils";
import { relativePathToFile } from "../../utils";

const meta = {
  type: "problem",
  docs: {
    description:
      "Disallows hooks to be exported in the GQL source file. Encourages to use the generated hooks in query|mutation.generated.tsx",
    category: "gql-no-manual-hook-declaration",
    recommended: false,
  },
  fixable: null,
  schema: [
    {
      type: "object",
      properties: {
        namespaceIgnoreList: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      additionalProperties: false,
    },
  ],
};

const reactHookPrefix = new RegExp("use\\w+");

const create = context => {
  const isGqlObjectFile = isGqlFile(context);
  const { namespaceIgnoreList } = context.options[0];

  const isInIgnoreList = () => {
    const pathToFile = relativePathToFile(context);
    return namespaceIgnoreList.some(ignoredNamespace => pathToFile.startsWith(ignoredNamespace));
  };

  const isHookDeclaredManually = (node, name) => {
    if (reactHookPrefix.test(name)) {
      context.report({
        node: node,
        message: `The hook "${name}" is manually exported from this file. Please use the hook from the corresponding query or mutation generated file located next to this file instead"`,
      });
    }
  };

  const ExportNamedDeclaration = node => {
    // not a gql file or no value exported
    if (isInIgnoreList() || !isGqlObjectFile || node.exportKind !== "value") return;

    // When the variable is directly exported like so export const usePatientQuery =...
    if (node.declaration && node.declaration.declarations) {
      node.declaration.declarations.forEach(declaration => {
        isHookDeclaredManually(node, declaration.id.name);
      });
    } else {
      // When the variable is in the export statement like so export { usePatientQuery }
      node.specifiers.forEach(({ local }) => {
        isHookDeclaredManually(node, local.name);
      });
    }
  };

  return { ExportNamedDeclaration };
};

export { meta, create };
