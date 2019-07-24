// Type definitions for pseudo-localization
// Project: pseudo-localization
// Definitions by: Tryggvi Gylfason https://github.com/tryggvigy

type Options = { strategy?: 'accented' | 'bidi' };
type BrowserOptions = Options & { blacklistedNodeNames?: Array<string> };

namespace pseudoLocalization {
  export function start(options?: BrowserOptions): void;
  export function stop(): void;
  export function localize(str: string, options?: Options): void;
}

declare module 'pseudo-localization' {
  // allow for require syntax
  exports = pseudoLocalization
  export function start(options?: BrowserOptions): void;
  export function stop(): void;
  export function localize(str: string, options?: Options): void;
}
