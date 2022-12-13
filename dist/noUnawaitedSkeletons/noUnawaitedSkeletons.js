"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    meta: ()=>meta,
    create: ()=>create
});
const _utils = require("../utils");
const meta = {
    type: "problem",
    docs: {
        category: "code",
        description: "Enforces skeletons to be wrapped into `waitFor` to avoid `should be wrapped in act(...) error`"
    },
    hasSuggestions: false,
    fixable: false
};
const isWaitFor = (node)=>(0, _utils.isCalleName)(node, "waitFor");
// avairy skeletons have the below test ids; update if needed;
const TEST_IDS = [
    "aviary-skeleton"
];
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
 */ const WAIT_FOR_PATHS = [
    [
        "CallExpression",
        "MemberExpression",
        "MemberExpression",
        "CallExpression",
        "ExpressionStatement",
        "BlockStatement",
        "ArrowFunctionExpression",
        "CallExpression",
        "AwaitExpression"
    ],
    [
        "CallExpression",
        "MemberExpression",
        "CallExpression",
        "ExpressionStatement",
        "BlockStatement",
        "ArrowFunctionExpression",
        "CallExpression",
        "AwaitExpression"
    ],
    [
        "CallExpression",
        "MemberExpression",
        "CallExpression",
        "ArrowFunctionExpression",
        "CallExpression",
        "AwaitExpression"
    ],
    [
        "CallExpression",
        "MemberExpression",
        "MemberExpression",
        "CallExpression",
        "ArrowFunctionExpression",
        "CallExpression",
        "AwaitExpression"
    ]
];
const create = (context)=>{
    return {
        CallExpression: (node)=>{
            if (!(0, _utils.isExpect)(node)) return;
            const [call] = node.arguments;
            if (!(0, _utils.isCallExpression)(call)) return;
            const [literal] = call.arguments;
            if (!(0, _utils.isLiteral)(literal)) return;
            const { value  } = literal;
            if (!TEST_IDS.includes(value)) return;
            /**
       * Taking expect(...) call as the base
       * Going up by any of the paths the node should be `await waitFor` expressions
       * Report if it is not.
       * */ const awaitExpression = (0, _utils.findByPaths)(WAIT_FOR_PATHS, node);
            const isWrappedInWaitFor = (0, _utils.isAwaitExpression)(awaitExpression) && (0, _utils.isCallExpression)(awaitExpression.argument) && isWaitFor(awaitExpression.argument);
            if (isWrappedInWaitFor) return;
            context.report({
                node,
                message: "Should be wrapped into `waitFor`"
            });
        }
    };
};
