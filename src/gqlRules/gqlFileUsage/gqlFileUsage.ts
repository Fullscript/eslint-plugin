/**
 * @fileoverview Rule to disallow new GraphQL TypeScript files in favor of .gql files
 * @author Matthew Young
 */

import { relativePathToFile } from "../../utils";
import { execSync } from 'child_process';
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
          migrationStartDate: {
            type: "string",
            description: "Date when migration started (YYYY-MM-DD). Files existing before this date will be exempted."
          }
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noGraphqlTsxFiles:
        "Use \"{{ operationName }}.{{ operationType }}.gql\" file instead. The team is moving away from .tsx/.ts operation files.\n\nMore Info: https://docs.google.com/document/d/1s2qpdvmjevOUt7SgJA1RqWElk2S4XMrloVKEeYPvLfI",
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
    const migrationStartDate = options?.migrationStartDate;

    const isInIgnoreList = () => {
      if (!ignoreList?.length) return false;
      const pathToFile = relativePathToFile(context);
      return ignoreList.some(ignoredNamespace => pathToFile.startsWith(ignoredNamespace));
    };

    if (isInIgnoreList()) {
      return {};
    }

    // Check if file existed before migration start date
    const isExistingFile = () => {
      if (!migrationStartDate) {
        return false; // If no migration date set, treat all files as new
      }

      try {
        // Check if file existed before the migration start date
        const result = execSync(
          `git log --oneline --before="${migrationStartDate}" -- "${fileName}"`,
          {
            encoding: 'utf8',
            stdio: 'pipe',
            cwd: process.cwd()
          }
        );

        const hasHistoryBeforeMigration = result.trim().length > 0;

        return hasHistoryBeforeMigration;
      } catch (error) {
        // If git command fails, assume it's a new file
        return false;
      }
    };

    // If file existed before migration start, exempt it
    if (isExistingFile()) {
      return {};
    }

    // Extract the type (query, mutation, fragment) from the match
    const operationType = match[1];
    const extension = fileName.endsWith("x") ? ".tsx" : ".ts";
    const fileType = `.${operationType}${extension}`;

    const fileNameOnly = path.basename(fileName);
    const operationName = fileNameOnly.replace(/\.(query|mutation|fragment)\.tsx?$/, '');

    // Report the violation
    context.report({
      loc: { line: 1, column: 0 },
      messageId: "noGraphqlTsxFiles",
      data: {
        operationType,
        operationName,
        fileType,
      },
    });

    return {};
  };

  export { meta, create }
