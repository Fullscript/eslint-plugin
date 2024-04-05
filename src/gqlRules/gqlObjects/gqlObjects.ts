import { autoExportObject, isGqlFile } from "../utils";

const meta = {
  type: "problem",
  docs: {
    description: "GQL files must export a gql object",
    category: "gql-objects",
    recommended: false,
  },
  fixable: "code",
  schema: [],
};

const create = context => {
  const isGqlObjectFile = isGqlFile(context);

  const isGraphqlTagImported = node => {
    if (!node || !node.specifiers) return false;

    return !!node.specifiers.find(specifier => {
      return specifier.local && specifier.local.name === "gql";
    });
  };

  const ImportDeclarationValid = node => {
    if (isGraphqlTagImported(node)) {
      return isGqlObjectFile;
    }

    return true;
  };

  let gqlTags = [];
  const VariableDeclarator = node => {
    if (
      isGqlObjectFile &&
      node.init &&
      node.init.type === "TaggedTemplateExpression" &&
      node.init.tag &&
      node.init.tag.name === "gql"
    ) {
      gqlTags.push(node);
    }
  };

  let exports = [];
  let exportedNames = [];
  const ExportNamedDeclaration = node => {
    if (isGqlObjectFile && node.exportKind === "value") {
      exportedNames = [...exportedNames, ...node.specifiers.map(({ local }) => local.name)];
      exports = [...exports, node];
    }
  };

  const validateGqlTagExport = programNode => {
    for (const index in gqlTags) {
      const gqlTag = gqlTags[index];
      const gqlTagName = gqlTag.id.name;

      if (!exportedNames.includes(gqlTagName)) {
        context.report({
          node: exports[0] || gqlTag,
          message: "Graphql object files must export gql objects, please export: {{ identifier }}",
          data: {
            identifier: gqlTagName,
          },
          fix: fixer => autoExportObject(fixer, context, programNode, exports, gqlTagName),
        });
        break;
      }
    }
  };

  const hasProperExports = node => {
    if (isGqlObjectFile) {
      validateGqlTagExport(node);
    }
  };

  return {
    ImportDeclaration(node) {
      if (!ImportDeclarationValid(node)) {
        context.report({
          node,
          message:
            "Graphql objects must only exist in graphql files, please use a file extension of: .(query|mutation|fragment|subscription).ts",
        });
      }
    },
    VariableDeclarator,
    ExportNamedDeclaration,
    "Program:exit": hasProperExports,
  };
};

export { meta, create };
