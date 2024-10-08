import type { TSESLint } from '@typescript-eslint/utils';
import { DETECTED_IMPLICIT_ANY_ERROR_KEY } from './messageIds';

export type ImplicitAnyContext = Readonly<TSESLint.RuleContext<typeof DETECTED_IMPLICIT_ANY_ERROR_KEY, any[]>>
