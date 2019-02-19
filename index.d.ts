// Type definitions for pseudo-localization
// Project: https://github.com/tryggvigy/pseudo-localization
// TypeScript Version: 3.1

type Options = {
  strategy?: "accented" | "bidi",
  blacklistedNodeNames?: Array<string>,
}

declare module 'pseudo-localization/localize' {
  const pseudoLocalizeString: (options?: Options) => string;
  export default pseudoLocalizeString;
}

declare module 'pseudo-localization' {
  import pseudoLocalizeString from 'pseudo-localization/localize'
  const pseudoLocalization: {
    start: (options?: Options) => void,
    stop: () => void,
    localize: typeof pseudoLocalizeString,
  };
  export default pseudoLocalization;
}