import { MatchLocation } from './RouterProvider.cjs';
import { AnyPathParams } from './route.cjs';
export interface Segment {
    type: 'pathname' | 'param' | 'wildcard';
    value: string;
    prefixSegment?: string;
    suffixSegment?: string;
}
export declare function joinPaths(paths: Array<string | undefined>): string;
export declare function cleanPath(path: string): string;
export declare function trimPathLeft(path: string): string;
export declare function trimPathRight(path: string): string;
export declare function trimPath(path: string): string;
export declare function removeTrailingSlash(value: string, basepath: string): string;
export declare function exactPathTest(pathName1: string, pathName2: string, basepath: string): boolean;
interface ResolvePathOptions {
    basepath: string;
    base: string;
    to: string;
    trailingSlash?: 'always' | 'never' | 'preserve';
    caseSensitive?: boolean;
}
export declare function resolvePath({ basepath, base, to, trailingSlash, caseSensitive, }: ResolvePathOptions): string;
/**
 * Required: `/foo/$bar` ✅
 * Prefix and Suffix: `/foo/prefix${bar}suffix` ✅
 * Wildcard: `/foo/$` ✅
 * Wildcard with Prefix and Suffix: `/foo/prefix{$}suffix` ✅
 *
 * Future:
 * Optional: `/foo/{-bar}`
 * Optional named segment: `/foo/{bar}`
 * Optional named segment with Prefix and Suffix: `/foo/prefix{-bar}suffix`
 * Escape special characters:
 * - `/foo/[$]` - Static route
 * - `/foo/[$]{$foo} - Dynamic route with a static prefix of `$`
 * - `/foo/{$foo}[$]` - Dynamic route with a static suffix of `$`
 */
export declare function parsePathname(pathname?: string): Array<Segment>;
interface InterpolatePathOptions {
    path?: string;
    params: Record<string, unknown>;
    leaveWildcards?: boolean;
    leaveParams?: boolean;
    decodeCharMap?: Map<string, string>;
}
type InterPolatePathResult = {
    interpolatedPath: string;
    usedParams: Record<string, unknown>;
    isMissingParams: boolean;
};
export declare function interpolatePath({ path, params, leaveWildcards, leaveParams, decodeCharMap, }: InterpolatePathOptions): InterPolatePathResult;
export declare function matchPathname(basepath: string, currentPathname: string, matchLocation: Pick<MatchLocation, 'to' | 'fuzzy' | 'caseSensitive'>): AnyPathParams | undefined;
export declare function removeBasepath(basepath: string, pathname: string, caseSensitive?: boolean): string;
export declare function matchByPath(basepath: string, from: string, matchLocation: Pick<MatchLocation, 'to' | 'caseSensitive' | 'fuzzy'>): Record<string, string> | undefined;
export {};
