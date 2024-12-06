export const meta = {
  type: "problem",
  docs: {
    description: "Prevents conditionals in return statements",
    category: "no-conditionals-in-return-statements",
    recommended: false,
  },
  fixable: null,
  schema: [
    {
      type: "object",
      properties: {
        allowedConditionals: { type: "array", ignoredFilePaths: { type: "string" } },
      },
    },
  ],
  defaultOptions: {
    ignoredFilePaths: [],
  },
};


interface ReturnStatementWithConditionalExpression {
  status: boolean;
  conditionals: {
    position: number
    node: Node;
  }[]
}

export const searchForConditionalsInReturnStatements = (filePath: string, sourceCode: string | any): Array<ReturnStatementWithConditionalExpression> => {
  const allReturnStatements = sourceCode.findNodes(ast => ast.type === "ReturnStatement");

  return allReturnStatements.map(returnStatement => {
    const conditionals = returnStatement.findNodes(ast => ast.type === "ConditionalExpression");

    if (conditionals.length === 0) {
      return {
        status: false,
        conditionals: [],
      }
    }

    const conditionalsInAGivenReturnStatement = conditionals.map(conditional => {
      return {
        position: conditional.range[0],
        node: conditional,
      };
    });

    return {
      status: true,
      conditionals: conditionalsInAGivenReturnStatement,
    }

  });
};


// Note: Context is the current context
export const create = context => {
  const { ignoredFilePaths } = context.options?.[0] || {};
  const filePath = context.physicalFilename;

  if (ignoredFilePaths.includes(filePath)) {
    return {};
  }

  const sourceCode = context.sourceCode();
  const result = searchForConditionalsInReturnStatements(filePath, sourceCode);

  return {
    ReturnStatement: (node) => {
      result.forEach(returnStatement => {
        if (returnStatement.status) {
          returnStatement.conditionals?.forEach(conditional => {
            context.report({
              node: conditional.node,
              message: "Conditional expression found in return statement at position ${conditional.position}",
            });
          })
        }
      })
    }
  };
};

