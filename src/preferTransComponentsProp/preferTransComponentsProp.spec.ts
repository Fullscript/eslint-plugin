import { RuleTester } from "eslint";
import type { Rule } from "eslint";
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

ruleTester.run("prefer-trans-components-prop", rule as Rule.RuleModule, {
  valid: [
    // Valid case: using components prop with Trans
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey="namespace.key"
            components={{
              link: <Link href="/support" />
            }}
          />
        );
      `,
    },
    // Valid case: Trans without i18nKey
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans>Some text without i18nKey</Trans>
        );
      `,
    },
    // Valid case: Trans from different library
    {
      code: `
        import { Trans } from 'other-library';
        const Component = () => (
          <Trans i18nKey="namespace.key">Text with elements <a href="/link">Link</a></Trans>
        );
      `,
    },
    // Valid case: Trans with empty children
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey="namespace.key"></Trans>
        );
      `,
    },
    // Valid case: Trans with only whitespace children
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans i18nKey="namespace.key">
            {/* This is just whitespace */}
          </Trans>
        );
      `,
    },
  ],
  invalid: [
    // Invalid case: Trans with i18nKey and embedded elements
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
          message:
            "Prefer using the 'components' prop with Trans instead of embedding elements directly. This avoids duplication and simplifies maintenance.",
        },
      ],
    },
    // Invalid case: Trans with i18nKey and mixed content
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
          message:
            "Prefer using the 'components' prop with Trans instead of embedding elements directly. This avoids duplication and simplifies maintenance.",
        },
      ],
    },
    // Invalid case: Trans with both components prop AND content (which is redundant)
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey="namespace.key"
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
          message:
            "When using the 'components' prop with Trans, you should not include children. The component should be self-closing.",
        },
      ],
    },
    // Invalid case: Trans with non-self-closing components in the components prop
    {
      code: `
        import { Trans } from 'react-i18next';
        const Component = () => (
          <Trans 
            i18nKey="namespace.key"
            components={{
              learnMore: <Link href="/support">Learn more</Link> // Should be self-closing
            }}
          />
        );
      `,
      errors: [
        {
          message:
            "Components in the 'components' prop should be self-closing tags without text content. Found non-empty content in <Link>.",
        },
      ],
    },
  ],
});
