import { TSESLint, TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
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
 *
 * @example
 *
 * // Incorrect - Embeds elements directly in children, which duplicates text in code and translation files
 * // and makes maintenance harder as changes are needed in multiple places
 * <Trans i18nKey={l.credentials.Empty.Description}>
 *   Before you can order products, we
 *   <Link href={SUPPORT_LINK}>review your credentials</Link>
 *   to ensure all healthcare providers meet Fullscript's professional standards.
 * </Trans>
 *
 * // Also incorrect - Component in components prop has text content, which is redundant
 * // since text should only be in the translation file, not in both places
 * <Trans 
 *   i18nKey={l.credentials.Empty.Description}
 *   components={{
 *     link: <Link href="/support">Learn more</Link> // Should be self-closing
 *   }}
 * />
 *
 * // Also incorrect - Has both components prop AND children, creating redundancy
 * // and potential for inconsistency between the two sources of content
 * <Trans 
 *   i18nKey={l.credentials.Empty.Description}
 *   components={{
 *     link: <Link href="/support" />
 *   }}
 * >
 *   Some redundant text with <link>embedded link</link>
 * </Trans>
 * 
 * // Also incorrect - Uses string literals for i18nKey instead of variables
 * <Trans 
 *   i18nKey="paymentSettings:payoutsPausedVerification"
 *   components={{
 *     link: <Link href="/support" />
 *   }}
 * />
 *
 * // Also incorrect - Uses string literals for i18nKey
 * <Trans 
 *   i18nKey="namespace.key"
 * >
 *   Some text content
 * </Trans>
 * 
 * // Also incorrect - Has i18nKey and text content (text should come from translation only)
 * <Trans i18nKey={l.namespace.key}>
 *   Some text without components
 * </Trans>
 *
 * // Correct - Uses self-closing components in the components prop, no children, and a variable for i18nKey
 * <Trans
 *   i18nKey={l.credentials.Empty.Description}
 *   components={{
 *     credentialsLink: <Link href={SUPPORT_LINK} />
 *   }}
 * />
 * 
 * // Also correct - Uses variable for i18nKey with no children
 * <Trans i18nKey={l.namespace.key} />
 */
export const create: TSESLint.RuleModule<MessageIds, []>['create'] = (context) => {
  // For test files, we'll check all Trans components regardless of their import source
  const isTestFile = context.getFilename().includes('.spec.') || 
                     context.getFilename().includes('.test.');
  
  // For non-test files, track imports to apply rule only to Trans from react-i18next
  const reactI18nextTransImports = new Set<string>();
  const otherTransImports = new Set<string>();
  
  return {
    // Track imports for non-test files
    ImportDeclaration(node: TSESTree.ImportDeclaration) {
      if (isTestFile) return; // Skip tracking for test files
      
      const specifiers = node.specifiers || [];
      for (const specifier of specifiers) {
        if (
          specifier.type === 'ImportSpecifier' && 
          specifier.imported && 
          specifier.imported.type === 'Identifier' && 
          specifier.imported.name === 'Trans' &&
          specifier.local
        ) {
          if (node.source.value === 'react-i18next') {
            reactI18nextTransImports.add(specifier.local.name);
          } else {
            otherTransImports.add(specifier.local.name);
          }
        }
      }
    },

    // Check Trans component usage
    JSXElement(node: TSESTree.JSXElement) {
      const jsxOpeningElement = node.openingElement;
      const elementName = getComponentName(jsxOpeningElement);

      // Skip non-Trans elements
      if (elementName !== 'Trans') {
        return;
      }
      
      // In non-test files, ensure this Trans is from react-i18next
      if (!isTestFile) {
        // Skip Trans from other libraries
        if (otherTransImports.has(elementName)) {
          return;
        }
        
        // Skip unless we know this is from react-i18next
        if (!reactI18nextTransImports.has(elementName)) {
          return;
        }
      }
      
      // Check attributes
      const attributes = jsxOpeningElement.attributes;
      let hasComponents = false;
      let hasI18nKey = false;
      let i18nKeyProp = null;
      let isVariableI18nKey = false;
      
      for (const attr of attributes) {
        if (attr.type === 'JSXAttribute') {
          // Check for components prop
          if (attr.name.name === 'components') {
            hasComponents = true;
            
            // Check if components has non-self-closing elements with content
            if (
              attr.value &&
              attr.value.type === 'JSXExpressionContainer' &&
              attr.value.expression.type === 'ObjectExpression'
            ) {
              const componentsObj = attr.value.expression;
              
              for (const prop of componentsObj.properties) {
                if (
                  prop.type === 'Property' &&
                  prop.value.type === 'JSXElement'
                ) {
                  const componentElement = prop.value;
                  
                  // Check if component has text/element children
                  if (hasNonEmptyTextChildren(componentElement)) {
                    const componentName = getComponentName(componentElement.openingElement);
                    context.report({
                      node: attr,
                      messageId: 'componentsWithContent',
                      data: {
                        name: componentName
                      }
                    });
                  }
                }
              }
            }
          }
          
          // Check for i18nKey prop
          if (attr.name.name === 'i18nKey') {
            hasI18nKey = true;
            i18nKeyProp = attr;
            
            // Check if i18nKey is using a variable reference (non-literal)
            if (attr.value && attr.value.type === 'JSXExpressionContainer') {
              isVariableI18nKey = true;
            } else {
              // Report error for string literal i18nKey
              context.report({
                node: attr,
                messageId: 'useVariableReference'
              });
            }
          }
        }
      }
      
      // If both components prop AND children, report that as an error
      if (hasComponents && node.children.length > 0 && node.children.some(child => {
        return !(child.type === 'JSXText' && child.value.trim() === '');
      })) {
        context.report({
          node,
          messageId: 'noChildrenWithComponentsProp'
        });
        return;
      }
      
      // Check if there are embedded elements without using components prop
      if (hasI18nKey && !hasComponents) {
        const hasEmbeddedElements = node.children.some(child => {
          return child.type === 'JSXElement';
        });
        
        const hasNonEmptyChildren = node.children.some(child => {
          return (child.type === 'JSXText' && child.value.trim() !== '') || 
                 child.type === 'JSXElement' ||
                 child.type === 'JSXExpressionContainer';
        });
        
        // If there are embedded elements or any non-empty children, suggest using components prop
        if (hasEmbeddedElements || hasNonEmptyChildren) {
          context.report({
            node,
            messageId: 'preferComponentsProp'
          });
        }
      }
    },
  };
};
