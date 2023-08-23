import {
  isObjectExpression,
  isArrayExpression,
  isSpreadElement,
  isCallExpression,
  isProperty,
  isCalleName,
} from "../utils";

const meta = {
  type: "problem",
  docs: {
    description: "Disallows nested createMock invokations in preference of maxDepth",
    category: "createMock",
    recommended: false,
  },
  fixable: null,
  schema: [
    {
      type: "object",
      properties: {
        setFunctions: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["setFunctions"],
      additionalProperties: false,
    },
  ],
};

/**
 * Determines if the passed expression is a spread of a ...createMock({}) call
 * @param {import("@types/estree").Expression} expression
 * @returns {boolean}
 */
const isSpreadElementAndCreateMock = node => {
  return isSpreadElement(node) && isCalleName(node.argument, "createMock");
};

/**
 * Determines if the passed expression is a call of createMock
 * @param {import("@types/estree").Expression} expression
 * @returns {boolean}
 */
const isCallExpressionAndCreateMock = node => {
  return isCallExpression(node) && isCalleName(node, "createMock");
};

/**
 * Determines if the passed expression is an object property and has a array or object value
 * @param {import("@types/estree").Expression} expression
 * @returns {boolean}
 */
const isPropertyWithArrayOrObjectValue = node => {
  return isProperty(node) && (isArrayExpression(node.value) || isObjectExpression(node.value));
};

/**
 * Determines if the specified Expression contains a call to createMock
 * @param {import("@types/estree").Expression} expression
 * @returns {boolean}
 */
const hasNestedCreateMock = expression => {
  // Cases where you are passing a variable into setFunction
  // setCurrentOffice(mockOffice);
  // For now we will assume that mockOffice doesn't contain a call to createMock
  if (!isObjectExpression(expression) && !isArrayExpression(expression)) return false;

  // Objects contain properties, Arrays contain elements
  return (expression.properties || expression.elements).some(node => {
    if (isSpreadElementAndCreateMock(node)) {
      // setCurrentOffice({ wholesaleCart: { ...createMock(...) } });
      // OR
      // setCurrentOffice({ ...createMock(...) });
      return true;
    } else if (isCallExpressionAndCreateMock(node)) {
      // setViewer({ promotions: { nodes: [createMock(...)]}});
      return true;
    } else if (isObjectExpression(node)) {
      //setCurrentStore({ promotions: { nodes: [ { foo: createMock(...) } ] }});
      return hasNestedCreateMock(node);
    } else if (isPropertyWithArrayOrObjectValue(node)) {
      // setCurrentOffice({ cart: { billingAddress: createMock(...) } });
      // OR
      // setCurrentStore({ promotions: { nodes: [ { foo: createMock(...) }] } });
      return hasNestedCreateMock(node.value);
    } else if (isProperty(node) && isCallExpressionAndCreateMock(node.value)) {
      // setCurrentOffice({ cart: createMock(...) });
      return true;
    }
  });
};

/**
 * Determines if the specified Identifier is a gql setFunction
 * @param {import("@types/estree").Identifier} identifier
 * @returns {boolean}
 */
const isSetFunction = (identifier, setFunctions) => {
  return setFunctions.includes(identifier.name);
};

/**
 * Detects usages of createMock within set*Functions such as setCurrentPatient, setCurrentPractitioner etc.
 * The following example would violate this rule.
 *
 * ```ts
 * setCurrentOffice({
 *   wholesaleCart: {
 *     id: "wholesale-1",
 *     ...createMock({ typeName: "WholesaleOrder", overrides: { state: "New York"}}),
 *   }
 * })
 * ```
 * @param {import("@types/eslint").Rule.RuleContext} context
 * @returns {import("@types/eslint").Rule.RuleListener}
 */
const create = context => {
  const { setFunctions } = context.options[0];

  return {
    CallExpression: node => {
      if (node.callee.type === "Identifier" && isSetFunction(node.callee, setFunctions)) {
        const setFunctionName = node.callee.name;
        const objectParam = node.arguments[0]; // setFunctions only ever have a single argument

        if (hasNestedCreateMock(objectParam)) {
          context.report({
            node,
            message: `${setFunctionName} should not contain nested createMock call(s). You can specify overrides directly in ${setFunctionName}.`,
          });
        }
      }
    },
  };
};

export { meta, create };
