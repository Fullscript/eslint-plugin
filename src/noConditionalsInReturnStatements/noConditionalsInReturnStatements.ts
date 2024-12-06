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
        allowedConditionals: { type: "array", ignoredFiles: { type: "string" } },
      },
    },
  ],
  defaultOptions: {
    ignoredFiles: [],
  },
};


const searchForConditionalsInReturnStatements = (context): Array<string> => {
  return [];
};


// Note: Context is the current context
export const create = context => {
  const { ignoredFiles } = context.options?.[0] || {};
  const filename = context.getFilename();

  if (ignoredFiles.includes(filename)) {
    return {};
  }

  const result = searchForConditionalsInReturnStatements(context);


  return {
    ReturnStatement(node) {
      console.log(node);
    },
  };
};
