/**
 * @fileoverview Rule to disallow new GraphQL TypeScript files in favor of .gql files
 * @author Matthew Young
 */

import { relativePathToFile, shouldFileBeLinted } from "../../utils";
import path from 'path';

const meta = {
    type: "problem",
    docs: {
      description:
        "Disallow new .query.ts*, .mutation.ts*, and .fragment.ts* files in favor of .gql files",
      category: "GraphQL",
      recommended: true,
    },
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
          baseBranch: {
            type: "string",
            description: "Base branch to compare against (default: 'staging')",
            default: "staging"
          },
          developmentMode: {
            type: "boolean",
            description: "Indicate rule is running in IDE developement, not CI or command line check",
            default: undefined
          },
          fileTargetting: {
            type: "string",
            description: "Determine level of file targeting for incremental adoption (values: 'all', 'new', 'modified')",
            default: 'all'
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noGraphqlTsxFiles:
        "Use \"{{ operationName }}.{{ operationType }}.gql\" file instead. The team is moving away from .tsx/.ts operation files.\nIf you encounter any issues with the .gql generated types, please notify #eng-hopper\nMigration guide: https://docs.google.com/document/d/1s2qpdvmjevOUt7SgJA1RqWElk2S4XMrloVKEeYPvLfI",
    }
  };

  const create = (context) => {
    const fileName = context.getFilename();
    const match = fileName.match(/\.(query|mutation|fragment)\.tsx?$/);

    if (!match) {
      return {};
    }

    const options = context?.options?.[0] || {};
    const ignoreList = options?.namespaceIgnoreList ?? [];
    const baseBranch = options?.baseBranch || 'staging';
    const fileTargetting = options?.fileTargetting ?? 'all'
    const developmentMode = options?.developmentMode

    const isInIgnoreList = () => {
      if (!ignoreList?.length) return false;
      const pathToFile = relativePathToFile(context);
      return ignoreList.some(ignoredNamespace => pathToFile.startsWith(ignoredNamespace));
    };

    if (isInIgnoreList()) {
      return {};
    }

    // Check if this file should be linted based on git diff
    if (fileTargetting !== 'all' && !shouldFileBeLinted(fileName, baseBranch, fileTargetting === 'new', developmentMode)) {
      return {};
    }


    // Extract the type (query, mutation, fragment) from the match
    const operationType = match[1];
    const fileNameOnly = path.basename(fileName);
    const operationName = fileNameOnly.replace(/\.(query|mutation|fragment)\.tsx?$/, '');

    // Report the violation
    context.report({
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: context.getSourceCode().lines[0]?.length || 0 }
      },
      messageId: "noGraphqlTsxFiles",
      data: {
        operationType,
        operationName,
      },
    });

    return {};
  };

  export { meta, create }
