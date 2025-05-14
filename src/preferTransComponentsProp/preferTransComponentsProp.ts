import type { Rule } from 'eslint';
import type { TSESTree } from '@typescript-eslint/types';
import { getComponentName, hasNonEmptyTextChildren } from '../utils/ast/astUtils';

export const meta: Rule.RuleMetadata = {
  type: "suggestion",
  docs: {
    description: "Enforces using components prop with Trans instead of embedding elements",
    category: "Best Practices",
    recommended: true,
  },
  fixable: null, // We'll start without auto-fix
};

/**
 * Checks if a Trans component from react-i18next is using embedded elements instead of
 * the recommended 'components' prop pattern.
 *
 * @example
 *
 * // Incorrect - Embeds elements directly in children, which duplicates text in code and translation files
 * // and makes maintenance harder as changes are needed in multiple places
 * <Trans i18nKey={l.credentials.Empty.Description}>
 *   Before you can order products, we
 *   <Link href={SUPPORT_LINK}>review your credentials</Link>
 *   to ensure all healthcare providers meet Emerson's professional standards.
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
 * // Correct - Uses self-closing components in the components prop and no children
 * <Trans
 *   i18nKey={l.credentials.Empty.Description}
 *   components={{
 *     credentialsLink: <Link href={SUPPORT_LINK} />
 *   }}
 * />
 */
export const create: Rule.RuleModule['create'] = (context) => {
  // Track if Trans is imported from react-i18next
  let transImportedFromI18next = false;
  
  return {
    // Track imports
    ImportDeclaration(node: TSESTree.ImportDeclaration) {
      // Check if import is from react-i18next
      if (node.source.value === 'react-i18next') {
        // Check if Trans is imported
        const specifiers = node.specifiers || [];
        for (const specifier of specifiers) {
          if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'Trans') {
            transImportedFromI18next = true;
          }
        }
      }
    },
    
    // Check JSX elements
    JSXElement(node: TSESTree.JSXElement) {
      // Only process if Trans is imported from react-i18next
      if (!transImportedFromI18next) return;
      
      // Check if element is Trans
      const elementName = node.openingElement.name;
      if (elementName.type !== 'JSXIdentifier' || elementName.name !== 'Trans') return;
      
      // Check if it has i18nKey prop
      const hasI18nKey = node.openingElement.attributes.some(
        (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'i18nKey'
      );
      
      // Find the components prop if it exists
      const componentsProp = node.openingElement.attributes.find(
        (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'components'
      ) as TSESTree.JSXAttribute | undefined;
      
      const hasComponentsProp = !!componentsProp;

      // Check if it has children (excluding whitespace and comments)
      const hasNonWhitespaceChildren = node.children && node.children.some(child => {
        // Skip whitespace text nodes
        if (child.type === 'JSXText' && child.value.trim() === '') {
          return false;
        }
        
        // Skip JSX comments
        if (child.type === 'JSXExpressionContainer' && 
            child.expression && 
            child.expression.type === 'JSXEmptyExpression') {
          return false;
        }
        
        return true;
      });
      
      // Case 1: Has i18nKey, no components prop, and has children - basic rule
      if (hasI18nKey && !hasComponentsProp && hasNonWhitespaceChildren) {
        context.report({
          node,
          message: `Prefer using the 'components' prop with Trans instead of embedding elements directly. This avoids duplication and simplifies maintenance.`
        });
        return;
      }

      // Case 2: Has both components prop AND children - this is redundant
      if (hasComponentsProp && hasNonWhitespaceChildren) {
        context.report({
          node,
          message: `When using the 'components' prop with Trans, you should not include children. The component should be self-closing.`
        });
        return;
      }

      // Case 3: Check if components in the components prop have text content
      if (hasComponentsProp && componentsProp.value && componentsProp.value.type === 'JSXExpressionContainer') {
        const expression = componentsProp.value.expression;
        
        // Look for object expressions in the components prop
        if (expression.type === 'ObjectExpression') {
          for (const property of expression.properties) {
            if (property.type === 'Property' && property.value.type === 'JSXElement') {
              const componentElement = property.value;
              
              // Check if this component has text children
              if (hasNonEmptyTextChildren(componentElement)) {
                const componentName = getComponentName(componentElement);
                context.report({
                  node: componentElement,
                  message: `Components in the 'components' prop should be self-closing tags without text content. Found non-empty content in <${componentName}>.`
                });
                return;
              }
            }
          }
        }
      }
    }
  };
};
