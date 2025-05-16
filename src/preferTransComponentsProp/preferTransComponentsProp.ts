import { TSESLint, TSESTree } from '@typescript-eslint/utils';
import { getComponentName, hasNonEmptyTextChildren } from '../utils/ast/astUtils';

// Define message IDs for the rule
type MessageIds = 
  | 'useVariableReference'
  | 'preferComponentsProp'
  | 'noChildrenWithComponentsProp'
  | 'componentsWithContent';

export const meta: TSESLint.RuleMetaData<MessageIds, []> = {
  type: "suggestion",
  docs: {
    description: "Enforces using components prop with Trans instead of embedding elements and ensures i18nKey is a variable reference",
    recommended: 'recommended',
  },
  fixable: null, // We'll start without auto-fix
  schema: [], // no options
  messages: {
    useVariableReference: "i18nKey prop should use a variable reference like {l.namespace.key} instead of a string literal.",
    preferComponentsProp: "Prefer using the 'components' prop with Trans instead of embedding elements directly. This avoids duplication and simplifies maintenance.",
    noChildrenWithComponentsProp: "When using the 'components' prop with Trans, you should not include children. The component should be self-closing.",
    componentsWithContent: "Components in the 'components' prop should be self-closing tags without text content. Found non-empty content in <{{name}}>."
  }
};

// Default options for the rule
export const defaultOptions: [] = [];

/**
 * Checks if a Trans component from react-i18next is using embedded elements instead of
 * the recommended 'components' prop pattern and ensures i18nKey is a variable reference.
 */
export const create: TSESLint.RuleModule<MessageIds, []>['create'] = (context: TSESLint.RuleContext<MessageIds, []>) => {
  return {
    JSXElement(node: TSESTree.JSXElement) {
      if (
        node.openingElement.name.type !== 'JSXIdentifier' ||
        node.openingElement.name.name !== 'Trans'
      ) {
        return; // Not a Trans component, ignore
      }

      // First, let's check if there's an import statement for Trans from another library
      const sourceCode = context.getSourceCode();
      const program = sourceCode.ast.body;
      
      // Check if there are any import statements that import Trans from a non-react-i18next source
      const nonReactI18nextImport = program.some(statement => {
        if (statement.type === 'ImportDeclaration' && 
            statement.source.value !== 'react-i18next') {
          return statement.specifiers.some(
            specifier => specifier.type === 'ImportSpecifier' && 
                        specifier.imported.name === 'Trans'
          );
        }
        return false;
      });
      
      // Skip this Trans component if it's explicitly imported from another library
      if (nonReactI18nextImport) {
        return;
      }

      // Find attributes and check children
      let i18nKeyProp = null;
      let hasComponents = false;
      let isStringLiteral = false;
      let componentsWithContentProps = [];

      // Check attributes
      for (const attr of node.openingElement.attributes) {
        if (attr.type !== 'JSXAttribute') continue;

        // Track components prop
        if (attr.name.name === 'components') {
          hasComponents = true;

          // Check for component elements with content inside components prop
          if (
            attr.value?.type === 'JSXExpressionContainer' &&
            attr.value.expression.type === 'ObjectExpression'
          ) {
            const componentsObj = attr.value.expression;
            
            for (const prop of componentsObj.properties) {
              if (
                prop.type === 'Property' &&
                prop.value.type === 'JSXElement'
              ) {
                const componentElement = prop.value;
                
                if (hasNonEmptyTextChildren(componentElement)) {
                  const componentName = getComponentName(componentElement.openingElement);
                  
                  // Store for later reporting if needed
                  componentsWithContentProps.push({
                    prop: attr,
                    name: componentName,
                    element: componentElement
                  });
                }
              }
            }
          }
        }
        
        // Track i18nKey prop
        if (attr.name.name === 'i18nKey') {
          i18nKeyProp = attr;
          
          // Check for string literals in i18nKey - more comprehensive detection
          if (attr.value?.type === 'Literal') { 
            // Direct string literals: i18nKey="string"
            isStringLiteral = true;
          } else if (
            attr.value?.type === 'JSXExpressionContainer' &&
            attr.value.expression.type === 'Literal'
          ) {
            // String literals in expression containers: i18nKey={"string"}
            isStringLiteral = true;
          } else if (
            attr.value && typeof attr.value === 'object' && 'value' in attr.value && 
            typeof attr.value.value === 'string'
          ) {
            // Other possible string literal representations
            isStringLiteral = true;
          }
        }
      }

      // Check for non-empty children, properly handling JSX comments
      const hasNonEmptyChildren = node.children.some(child => {
        if (child.type === 'JSXText') {
          // Empty text nodes don't count, e.g. whitespace between elements
          return child.value.trim() !== '';
        }
        // Skip JSX comments in expression containers
        if (child.type === 'JSXExpressionContainer' && 
            child.expression.type === 'JSXEmptyExpression') {
          return false;
        }
        // Check for actual elements or non-comment expressions
        return child.type === 'JSXElement' || 
               (child.type === 'JSXExpressionContainer' && 
                child.expression.type !== 'JSXEmptyExpression');
      });

      // Report errors in priority order
      
      // Priority 1: Check for components + children (both is redundant)
      if (hasComponents && hasNonEmptyChildren) {
        context.report({
          node,
          messageId: 'noChildrenWithComponentsProp'
        });
        return; // Stop after reporting this error
      }
      
      // Priority 2: Components with content
      if (componentsWithContentProps.length > 0) {
        const { prop, name, element } = componentsWithContentProps[0];
        
        context.report({
          node: prop,
          messageId: 'componentsWithContent',
          data: {
            name: name // Use the component name directly without special casing
          }
        });
        return; // Stop after reporting this error
      }
      
      // Priority 3: i18nKey literal
      if (isStringLiteral && i18nKeyProp) {
        context.report({
          node: i18nKeyProp,
          messageId: 'useVariableReference'
        });
        return; // Stop after reporting this error
      }
      
      // Priority 4: Check for i18nKey + embedded elements instead of components
      if (i18nKeyProp && !hasComponents && hasNonEmptyChildren) {
        context.report({
          node,
          messageId: 'preferComponentsProp'
        });
        return;
      }
    },
  };
};
