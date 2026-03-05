/* ==========================================================================
 * Remaining core JS / TS rules NG examples
 * Rules that were not yet detected in previous files
 * ========================================================================== */

// ---------------------------------------------------------------------------
// For-direction
//   For loop counter going in wrong direction
// ---------------------------------------------------------------------------
const wrongDirection = () => {
  for (let i = 10; i >= 0; i++) {
    break;
  }
};

// ---------------------------------------------------------------------------
// No-async-promise-executor
//   Promise executor should not be async
// ---------------------------------------------------------------------------
const asyncExecutor = new Promise(async (resolve) => {
  const val = await Promise.resolve(42);
  resolve(val);
});

// ---------------------------------------------------------------------------
// No-compare-neg-zero
//   Don't compare to -0
// ---------------------------------------------------------------------------
const negZero = (x: number) => x === -0;

// ---------------------------------------------------------------------------
// No-cond-assign
//   Assignment in condition
// ---------------------------------------------------------------------------
const condAssign = () => {
  let x: number;
  if ((x = 5)) {
    return x;
  }
  return 0;
};

// ---------------------------------------------------------------------------
// No-dupe-else-if
//   Duplicate conditions in if-else chain
// ---------------------------------------------------------------------------
const dupeElseIf = (val: string) => {
  if (val === 'a') {return 1;}
  if (val === 'b') {return 2;}
  if (val === 'a') {return 3;}
  return 0;
};

// ---------------------------------------------------------------------------
// No-case-declarations
//   Lexical declaration in case without block
// ---------------------------------------------------------------------------
const caseDeclarations = (val: string) => {
  switch (val) {
    case 'a':
      const msg = 'one';
      return msg;
    default:
      return '';
  }
};

// ---------------------------------------------------------------------------
// No-duplicate-case
//   Duplicate case in switch
// ---------------------------------------------------------------------------
const dupeCase = (val: number) => {
  switch (val) {
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 1:
      return 'one again';
    default:
      return 'other';
  }
};

// ---------------------------------------------------------------------------
// No-empty-pattern
//   Empty destructuring pattern
// ---------------------------------------------------------------------------
const emptyPattern = ({}: { name: string }) => 'hello';

// ---------------------------------------------------------------------------
// No-ex-assign
//   Don't reassign exception in catch
// ---------------------------------------------------------------------------
const exAssign = () => {
  try {
    throw new Error('oops');
  } catch (e) {
    e = new Error('replaced');
    return e;
  }
};

// ---------------------------------------------------------------------------
// No-sparse-arrays
//   Don't use sparse arrays (holes)
// ---------------------------------------------------------------------------
const sparse = [1, , 3];

// ---------------------------------------------------------------------------
// No-unsafe-finally
//   Don't use control flow in finally
// ---------------------------------------------------------------------------
const unsafeFinally = () => {
  try {
    return 1;
  } finally {
    return 2;
  }
};

// ---------------------------------------------------------------------------
// No-unsafe-optional-chaining
//   Unsafe use of optional chaining in arithmetic
// ---------------------------------------------------------------------------
const maybeObj: { val?: number } | undefined = undefined;
const unsafeOptChain = 1 + maybeObj?.val!;

// ---------------------------------------------------------------------------
// No-unused-labels
//   Unused label
// ---------------------------------------------------------------------------
const unusedLabel = () => {
  outer: for (let i = 0; i < 3; i++) {
    if (i === 1) break;
  }
};

// ---------------------------------------------------------------------------
// No-with
//   Don't use with statement (strict mode prevents this, but rule still exists)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Use-isnan
//   Use Number.isNaN() instead of comparison with NaN
// ---------------------------------------------------------------------------
const nanCheck = (val: number) => isNaN(val);
const nanCompare = (x: number) => (x === NaN ? 'nan' : 'ok');

// ---------------------------------------------------------------------------
// Valid-typeof
//   Typeof comparison must use valid string
// ---------------------------------------------------------------------------
const badTypeof = (val: unknown) => typeof val === 'strig';

// ---------------------------------------------------------------------------
// No-inner-declarations
//   Don't declare functions inside blocks
// ---------------------------------------------------------------------------
const innerDecl = (flag: boolean) => {
  if (flag) {
    function innerFn() {
      return 42;
    }
    return innerFn();
  }
  return 0;
};

// ---------------------------------------------------------------------------
// No-control-regex
//   Don't use control characters in regex
// ---------------------------------------------------------------------------
const controlRegex = /\x01/;

// ---------------------------------------------------------------------------
// No-empty-character-class
//   Empty character class in regex
// ---------------------------------------------------------------------------
const emptyCharClass = /^abc[]/;

// ---------------------------------------------------------------------------
// No-invalid-regexp
//   Invalid regex
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// No-regex-spaces
//   Multiple spaces in regex
// ---------------------------------------------------------------------------
const multiSpaceRegex = /foo {3}bar/;

// ---------------------------------------------------------------------------
// No-misleading-character-class
//   Misleading character class (e.g. multi-codepoint/surrogate in [])
// ---------------------------------------------------------------------------
const misleadingCharClass = /[👍]/;

// ---------------------------------------------------------------------------
// No-irregular-whitespace
//   No irregular whitespace (e.g. \u00a0)
// ---------------------------------------------------------------------------
const irregularWs = 'a b';

// ---------------------------------------------------------------------------
// No-useless-backreference
//   Backreference that will always be empty
// ---------------------------------------------------------------------------
const uselessBackref = /(?:a)|(b)\1/;
const uselessBackrefOptional = /(a?)\1/;

// ---------------------------------------------------------------------------
// No-octal
//   Octal literals
// ---------------------------------------------------------------------------
// Const octal = 071; // TypeScript prevents this in strict mode

// ---------------------------------------------------------------------------
// No-octal-escape
//   Octal escape sequences in strings
// ---------------------------------------------------------------------------
// Const octalEscape = '\251'; // TypeScript prevents in strict mode

// ---------------------------------------------------------------------------
// Prefer-destructuring
//   VariableDeclarator: object=true (must destructure object property)
//   AssignmentExpression: array=true
// ---------------------------------------------------------------------------
const obj = { age: 30, name: 'test' };
const {name} = obj;
const ageFromObj = obj.age;

// ---------------------------------------------------------------------------
// Prefer-spread
//   Use spread instead of apply
// ---------------------------------------------------------------------------
const numbers = [1, 2, 3];
const maxNum = Math.max.apply(Math, numbers);

// ---------------------------------------------------------------------------
// No-loop-func
//   Function created inside loop references mutable var
// ---------------------------------------------------------------------------
const loopFn = () => {
  const fns: (() => void)[] = [];
  for (var i = 0; i < 3; i++) {
    fns.push(() => console.log(i));
  }
  return fns;
};

// ---------------------------------------------------------------------------
// Global-require
//   Require() should be at top level
// ---------------------------------------------------------------------------
const lazyRequire = () => {
  const mod = require('path');
  return mod;
};

// ---------------------------------------------------------------------------
// No-new-require
//   Don't use new require()
// ---------------------------------------------------------------------------
// Const req = new require('path'); // TS prevents this

// ---------------------------------------------------------------------------
// No-path-concat
//   Don't concatenate __dirname with string
// ---------------------------------------------------------------------------
// Const fullPath = __dirname + '/file.txt'; // Only valid in CJS

// ---------------------------------------------------------------------------
// New-cap
//   NewIsCap: true → new must be used with capitalized function
// ---------------------------------------------------------------------------
const myConstructor = function myConstructor() {} as unknown as new () => object;
const thing = new myConstructor();

// ---------------------------------------------------------------------------
// Grouped-accessor-pairs
//   Getter and setter should be adjacent
// ---------------------------------------------------------------------------
const groupedAccessor = {
  get name() {
    return 'hello';
  },
  age: 30,
  set name(val: string) {
    console.log(val);
  },
};

// ---------------------------------------------------------------------------
// No-class-assign
//   Don't reassign a class
// ---------------------------------------------------------------------------
class ReassignedClass {}
// ReassignedClass = class {}; // TS prevents const reassignment

// ---------------------------------------------------------------------------
// No-extend-native
//   Don't extend native prototypes
// ---------------------------------------------------------------------------
Object.defineProperty(Array.prototype, 'customFlat', {
  value: () => [],
});

// ---------------------------------------------------------------------------
// No-nonoctal-decimal-escape
//   Don't use \8 or \9 escape in strings
// ---------------------------------------------------------------------------
// Const nonoctal = '\8'; // Strict mode prevents this

// ---------------------------------------------------------------------------
// Require-yield
//   Generator must have yield
// ---------------------------------------------------------------------------
function* noYield() {
  return 42;
}

// ---------------------------------------------------------------------------
// No-restricted-exports
//   Some export names may be restricted
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Strict
//   'use strict' is unnecessary in ES modules
// ---------------------------------------------------------------------------
// 'use strict'; // Would be at top of file, causing issues with imports

// ---------------------------------------------------------------------------
// No-shadow-restricted-names
//   Don't shadow NaN, Infinity, undefined, etc.
// ---------------------------------------------------------------------------
// Const undefined = 'bad'; // TS prevents this

// ---------------------------------------------------------------------------
// No-empty-function
//   Allow: arrowFunctions, functions, methods → need getter/setter to trigger
// ---------------------------------------------------------------------------
class EmptyGetterClass {
  get value() {}

  set value(_v: unknown) {}
}

// ---------------------------------------------------------------------------
// @typescript-eslint/triple-slash-reference
//   (must be demonstrated in a separate file at top-of-file)
// ---------------------------------------------------------------------------

export {
  wrongDirection,
  asyncExecutor,
  negZero,
  condAssign,
  dupeElseIf,
  caseDeclarations,
  dupeCase,
  emptyPattern,
  exAssign,
  sparse,
  unsafeFinally,
  unsafeOptChain,
  unusedLabel,
  nanCheck,
  nanCompare,
  badTypeof,
  innerDecl,
  controlRegex,
  emptyCharClass,
  multiSpaceRegex,
  misleadingCharClass,
  irregularWs,
  uselessBackref,
  uselessBackrefOptional,
  name,
  ageFromObj,
  maxNum,
  loopFn,
  lazyRequire,
  thing,
  groupedAccessor,
  ReassignedClass,
  noYield,
  EmptyGetterClass,
};
