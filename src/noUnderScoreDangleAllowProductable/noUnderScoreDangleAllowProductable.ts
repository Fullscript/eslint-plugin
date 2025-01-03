export const meta = {
    meta: {
        type: 'problem',
        docs: {
          description: 'disallow dangling underscores except for productable.__typename',
          category: 'Stylistic Issues',
          recommended: false,
        },
        schema: [],
        messages: {
          unexpectedUnderscore: 'Unexpected dangling underscore in property name.',
        },
      },
};

export const create = context => {
    return {
        MemberExpression(node) {
          // Logic to check for `productable.__typename`
          if (
            node.object.name === 'productable' &&
            node.property.name === '__typename' &&
            node.property.type === 'Identifier'
          ) {
            // Allow this pattern
            return;
          }

          // Otherwise, report the node if it has a dangling underscore
          if (node.property.name.startsWith('_') && !node.property.name.startsWith('__')) {
            context.report({
              node: node.property,
              messageId: 'unexpectedUnderscore',
            });
          }
        },
    }
};

