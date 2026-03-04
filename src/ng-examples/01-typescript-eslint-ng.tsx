/* ==========================================================================
 * @typescript-eslint/* rules NG examples
 * Source: plugin:@typescript-eslint/recommended + explicit rules
 * ========================================================================== */

// ---------------------------------------------------------------------------
// @typescript-eslint/ban-ts-comment
//   @ts-ignore is banned; use @ts-expect-error instead
// ---------------------------------------------------------------------------
// @ts-ignore
const tsIgnored: number = 'not a number' as unknown as number;

// ---------------------------------------------------------------------------
// @typescript-eslint/ban-types
//   Banned types: Object, Function, Boolean, Number, String, Symbol, {}
// ---------------------------------------------------------------------------
const badObj: Object = {};
const badFn: Function = () => {};
const badStr: String = 'hello';
const badNum: Number = 42;
const badBool: Boolean = true;

// ---------------------------------------------------------------------------
// @typescript-eslint/consistent-type-imports
//   Type-only imports must use `import type`
// ---------------------------------------------------------------------------
import { FC, ReactNode } from 'react';

const TypeDemo: FC<{ children: ReactNode }> = ({ children }) => <div>{children}</div>;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-array-constructor
//   Use [] instead of new Array()
// ---------------------------------------------------------------------------
const arr = new Array();

// ---------------------------------------------------------------------------
// @typescript-eslint/no-duplicate-enum-values
//   Enum members must have unique values
// ---------------------------------------------------------------------------
enum DuplicateEnum {
  A = 1,
  B = 2,
  C = 1,
}

// ---------------------------------------------------------------------------
// @typescript-eslint/no-explicit-any
//   Don't use `any` type
// ---------------------------------------------------------------------------
const parseAnything = (data: any): any => data;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-extra-non-null-assertion
//   Don't use double non-null assertion
// ---------------------------------------------------------------------------
const maybeNull: string | null = 'hello';
const doubleAssert = maybeNull!!;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-inferrable-types
//   NOTE: This rule is NOT enabled in the current config (not in recommended).
//         Included for reference only.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// @typescript-eslint/no-loss-of-precision
//   Numeric literals that lose precision
// ---------------------------------------------------------------------------
const tooLong = 9007199254740993;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-misused-new
//   Interfaces should not use `new` to describe constructor
// ---------------------------------------------------------------------------
interface BadInterface {
  new (): BadInterface;
}

// ---------------------------------------------------------------------------
// @typescript-eslint/no-namespace
//   Don't use TypeScript namespaces
// ---------------------------------------------------------------------------
namespace BadNamespace {
  export const val = 1;
}

// ---------------------------------------------------------------------------
// @typescript-eslint/no-non-null-asserted-optional-chain
//   Don't use `!` after optional chain `?.`
// ---------------------------------------------------------------------------
interface Nested {
  inner?: { value: string };
}
const nested: Nested = {};
const unsafeChain = nested.inner?.value!;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-this-alias
//   Don't alias `this`
// ---------------------------------------------------------------------------
class ThisAlias {
  method() {
    const self = this;
    return self;
  }
}

// ---------------------------------------------------------------------------
// @typescript-eslint/no-unnecessary-type-constraint
//   Don't constrain generic to `any` or `unknown` (it's the default)
// ---------------------------------------------------------------------------
const identity = <T extends any>(val: T): T => val;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-unsafe-declaration-merging
//   Don't merge interface with class of the same name
// ---------------------------------------------------------------------------
interface Mergeable {
  name: string;
}
class Mergeable {
  age = 0;
}

// ---------------------------------------------------------------------------
// @typescript-eslint/no-use-before-define
//   Don't reference before definition
// ---------------------------------------------------------------------------
const earlyRef = laterFn();
const laterFn = (): number => 42;

// ---------------------------------------------------------------------------
// @typescript-eslint/no-var-requires
//   Don't use require() for imports
// ---------------------------------------------------------------------------
const fs = require('fs');

// ---------------------------------------------------------------------------
// @typescript-eslint/prefer-as-const
//   Use `as const` instead of literal type assertion
// ---------------------------------------------------------------------------
const notConst = 'hello' as 'hello';

// ---------------------------------------------------------------------------
// @typescript-eslint/triple-slash-reference
//   Don't use triple-slash reference directives
// ---------------------------------------------------------------------------
/// <reference types="vite/client" />

export {
  tsIgnored,
  badObj,
  badFn,
  badStr,
  badNum,
  badBool,
  TypeDemo,
  arr,
  DuplicateEnum,
  parseAnything,
  doubleAssert,
  tooLong,
  BadNamespace,
  unsafeChain,
  ThisAlias,
  identity,
  Mergeable,
  earlyRef,
  laterFn,
  fs,
  notConst,
};
