import type { TSESLint } from '@typescript-eslint/utils';

const DETECTED_IMPLICIT_ANY_ERROR_KEY = "detectedImplicitAny";

export const meta = {
    docs: {
        description: 'Disallow implicit any',
    },
    type: 'problem',
    messages: { [DETECTED_IMPLICIT_ANY_ERROR_KEY]: 'An implicit any is detected. Add a specific type or explicit any type.' },
    fixable: 'code',
    schema: [],
};

function hasJSExtension(filePath: string) {
    return /\.(js|jsx|mjs|cjs)$/.test(filePath);
}

export const create = (context: Readonly<TSESLint.RuleContext<typeof DETECTED_IMPLICIT_ANY_ERROR_KEY, any[]>>) => {
    // Skip JavaScript files because this rule only targets TypeScript files
    if (hasJSExtension(context.filename)) return {};
    return {};
}
