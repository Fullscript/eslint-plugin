import { isCalleName, isCallExpression, isExpect, isLiteral, findByPaths } from "../utils";

const meta = {
  type: "problem",
  docs: {
    category: "code",
    description:
      "Enforces skeletons to be wrapped into `waitFor` to avoid `should be wrapped in act(...) error`",
  },
  hasSuggestions: false,
  fixable: false,
  schema: [
    {
      type: "object",
      properties: {
        testIds: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["testIds"],
      additionalProperties: false,
    },
  ],
};

const isWaitFor = node => isCalleName(node, "waitFor");

/**
 * @description the below constant array is for the following code examples
 * [0]
 * await waitFor(() => {
 *    expect(screen.queryByTestId("aviary-skeleton")).not.toBeInTheDocument();
 * });
 * [1]
 * await waitFor(() => {
 *    expect(screen.getByTestId("aviary-skeleton")).toBeInTheDocument();
 * });
 * [2]
 * await waitFor(() => expect(screen.queryAllByTestId("aviary-skeleton")).toHaveLength(0));
 * [3]
 * expect(screen.queryByTestId("aviary-skeleton")).not.toBeInTheDocument()
 */

const WAIT_FOR_PATHS = [
  [
    "CallExpression",
    "MemberExpression",
    "MemberExpression",
    "CallExpression",
    "ExpressionStatement",
    "BlockStatement",
    "ArrowFunctionExpression",
    "CallExpression",
    // "AwaitExpression", if we want to check for `await waitFor` instead of just `waitFor`
  ],
  [
    "CallExpression",
    "MemberExpression",
    "CallExpression",
    "ExpressionStatement",
    "BlockStatement",
    "ArrowFunctionExpression",
    "CallExpression",
    // "AwaitExpression",
  ],
  [
    "CallExpression",
    "MemberExpression",
    "CallExpression",
    "ArrowFunctionExpression",
    "CallExpression",
    // "AwaitExpression",
  ],
  [
    "CallExpression",
    "MemberExpression",
    "MemberExpression",
    "CallExpression",
    "ArrowFunctionExpression",
    "CallExpression",
    // "AwaitExpression",
  ],
];

const create = context => {
  const [{ testIds }] = context.options;
  return {
    CallExpression: node => {
      if (!isExpect(node)) return;

      const [call] = node.arguments;
      if (!isCallExpression(call)) return;

      const [literal] = call.arguments;
      if (!isLiteral(literal)) return;

      const { value } = literal;
      if (!testIds.includes(value)) return;
      /**
       * Taking expect(...) call as the base
       * Going up by any of the paths the found node should be `waitFor` expressions
       * Report if it is not.
       * */
      const callExpression = findByPaths(WAIT_FOR_PATHS, node);
      if (isWaitFor(callExpression)) return;

      context.report({
        node,
        message:
          "Checks for loading state should be wrapped in a `waitFor` block to prevent act warnings",
      });
    },
  };
};

export { meta, create };
