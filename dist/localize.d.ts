export declare type Strategy = "accented" | "bidi";
export declare type PseudoLocalizeStringOptions = {
    strategy?: Strategy;
};
declare const pseudoLocalizeString: (string: string, { strategy }?: PseudoLocalizeStringOptions) => string;
export default pseudoLocalizeString;
//# sourceMappingURL=localize.d.ts.map