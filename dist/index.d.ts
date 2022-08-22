import { PseudoLocalizeStringOptions } from './localize.js';
/**
 * export the underlying pseudo localization function so this import style
 *  import { localize } from 'pseudo-localization';
 * can be used.
 */
export { default as localize } from './localize.js';
declare type MutationObserverCallbackOptions = {
    blacklistedNodeNames?: string[];
};
declare type StartOptions = MutationObserverCallbackOptions & PseudoLocalizeStringOptions;
declare const pseudoLocalization: {
    start: ({ strategy, blacklistedNodeNames, }?: StartOptions) => void;
    stop: () => void;
    isEnabled: () => boolean;
    localize: (string: string, { strategy }?: PseudoLocalizeStringOptions) => string;
};
export default pseudoLocalization;
//# sourceMappingURL=index.d.ts.map