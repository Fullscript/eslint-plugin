import {
  isAwaitExpression,
  isCalleName,
  isCallExpression,
  isExpect,
  isLiteral,
  findByPaths,
} from "../utils";

const meta = {
  type: "problem",
  docs: {
    category: "code",
    description:
      "Enforces skeletons to be wrapped into `waitFor` to avoid `should be wrapped in act(...) error`",
  },
  hasSuggestions: false,
  fixable: false,
};

const isWaitFor = node => isCalleName(node, "waitFor");

// avairy skeletons have the below test ids; update if needed;
const TEST_IDS = ["aviary-skeleton"];

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
  return {
    CallExpression: node => {
      if (!isExpect(node)) return;

      const [call] = node.arguments;
      if (!isCallExpression(call)) return;

      const [literal] = call.arguments;
      if (!isLiteral(literal)) return;

      const { value } = literal;
      if (!TEST_IDS.includes(value)) return;
      /**
       * Taking expect(...) call as the base
       * Going up by any of the paths the found node should be `waitFor` expressions
       * Report if it is not.
       * */
      const callExpression = findByPaths(WAIT_FOR_PATHS, node);
      if (isWaitFor(callExpression)) return;

      context.report({
        node,
        message: "Should be wrapped into `waitFor`",
      });
    },
  };
};

export { meta, create };
