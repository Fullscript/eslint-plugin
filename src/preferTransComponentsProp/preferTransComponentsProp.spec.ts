import { RuleTester } from '@typescript-eslint/rule-tester';
import * as rule from "./preferTransComponentsProp";

const ruleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run("prefer-trans-components-prop", rule, {
  valid: [
    // Valid case: Trans with i18nKey as variable reference and components prop
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey={l.credentials.Empty.Description}
            components={{
              link: <Link href="/support" />
            }}
          />
        );
      `,
    },
    // Valid case: Trans without i18nKey (can have plain text)
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans>Some text without i18nKey</Trans>
        );
      `,
    },
    // Valid case: Trans from different library (can use string literals)
    {
      code: `
        import { Trans } from 'other-library';
        const Component = () => (
          <Trans i18nKey="namespace.key">Text with elements <a href="/link">Link</a></Trans>
        );
      `,
    },
    // Valid case: Trans with empty children and variable i18nKey
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey={l.namespace.key}></Trans>
        );
      `,
    },
    // Valid case: Trans with only whitespace children and variable i18nKey
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey={l.namespace.key}>
            {/* This is just whitespace */}
          </Trans>
        );
      `,
    },
    // Valid case: Trans with i18nKey as a MemberExpression
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey={translations.common.someKey}
            components={{
              link: <Link href="/support" />
            }}
          />
        );
      `,
    },
    // Valid case: Trans with i18nKey as a template literal with variables
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey={\`\${namespace}.\${key}\`}
            components={{
              link: <Link href="/support" />
            }}
          />
        );
      `,
    },
    // Valid case: Self-closing Trans with variable i18nKey
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey={l.namespace.key} />
        );
      `,
    },
  ],
  invalid: [
    // Invalid case: Trans with i18nKey as string literal 
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey="paymentSettings:payoutsPausedVerification"
            components={{
              link: <Link href="/support" />
            }}
          />
        );
      `,
      errors: [
        {
          messageId: "useVariableReference"
        },
      ],
    },
    // Invalid case: Trans with i18nKey as string literal and plain text content
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey="namespace.key">
            Some text content
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "useVariableReference"
        },
      ],
    },
    // Invalid case: Trans with variable i18nKey and plain text content (should not have text content)
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey={l.namespace.key}>
            Some text without components
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "preferComponentsProp"
        },
      ],
    },
    // Invalid case: Trans with i18nKey as string literal and embedded elements
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey="namespace.key">
            Text with embedded <Link href="/support">link</Link> element
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "useVariableReference"
        },
      ],
    },
    // Invalid case: Trans with i18nKey as string literal and mixed content
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey="namespace.key">
            Before you can order products, we
            <Link href={SUPPORT_LINK}>review your credentials</Link>
            to ensure all healthcare providers meet standards.
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "useVariableReference"
        },
      ],
    },
    // Invalid case: Trans with variable i18nKey but not using components prop for embedded elements
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey={l.namespace.key}>
            Text with embedded <Link href="/support">link</Link> element
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "preferComponentsProp"
        },
      ],
    },
    // Invalid case: Trans with both components prop AND children (which is redundant)
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey={l.namespace.key}
            components={{
              learnMore: <Link href="/support">Learn more</Link>
            }}
          >
            Some text with <learnMore>a link</learnMore> inside
          </Trans>
        );
      `,
      errors: [
        {
          messageId: "noChildrenWithComponentsProp"
        },
      ],
    },
    // Invalid case: Trans with non-self-closing components in the components prop
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey={l.namespace.key}
            components={{
              learnMore: <Link href="/support">Learn more</Link> // Should be self-closing
            }}
          />
        );
      `,
      errors: [
        {
          messageId: "componentsWithContent",
          data: { name: "Link" }
        },
      ],
    },
  ],
});
