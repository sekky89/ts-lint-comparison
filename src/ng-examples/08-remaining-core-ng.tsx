/* ==========================================================================
 * Remaining core JS / TS rules NG examples
 * Rules that were not yet detected in previous files
 * ========================================================================== */

// ---------------------------------------------------------------------------
// for-direction
//   for loop counter going in wrong direction
// ---------------------------------------------------------------------------
const wrongDirection = () => {
  for (let i = 10; i >= 0; i++) {
    break;
  }
};

// ---------------------------------------------------------------------------
// no-async-promise-executor
//   Promise executor should not be async
// ---------------------------------------------------------------------------
const asyncExecutor = new Promise(async (resolve) => {
  const val = await Promise.resolve(42);
  resolve(val);
});

// ---------------------------------------------------------------------------
// no-compare-neg-zero
//   Don't compare to -0
// ---------------------------------------------------------------------------
const negZero = (x: number) => x === -0;

// ---------------------------------------------------------------------------
// no-cond-assign
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
// no-dupe-else-if
//   Duplicate conditions in if-else chain
// ---------------------------------------------------------------------------
const dupeElseIf = (val: string) => {
  if (val === 'a') return 1;
  else if (val === 'b') return 2;
  else if (val === 'a') return 3;
  return 0;
};

// ---------------------------------------------------------------------------
// no-duplicate-case
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
// no-empty-pattern
//   Empty destructuring pattern
// ---------------------------------------------------------------------------
const emptyPattern = ({}: { name: string }) => 'hello';

// ---------------------------------------------------------------------------
// no-ex-assign
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
// no-sparse-arrays
//   Don't use sparse arrays (holes)
// ---------------------------------------------------------------------------
const sparse = [1, , 3];

// ---------------------------------------------------------------------------
// no-unsafe-finally
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
// no-unsafe-optional-chaining
//   Unsafe use of optional chaining in arithmetic
// ---------------------------------------------------------------------------
const maybeObj: { val?: number } | undefined = undefined;
const unsafeOptChain = 1 + maybeObj?.val!;

// ---------------------------------------------------------------------------
// no-unused-labels
//   Unused label
// ---------------------------------------------------------------------------
const unusedLabel = () => {
  myUnusedLabel: {
    const x = 1;
    return x;
  }
};

// ---------------------------------------------------------------------------
// no-with
//   Don't use with statement (strict mode prevents this, but rule still exists)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// use-isnan
//   Use Number.isNaN() instead of comparison with NaN
// ---------------------------------------------------------------------------
const nanCheck = (val: number) => val === NaN;

// ---------------------------------------------------------------------------
// valid-typeof
//   typeof comparison must use valid string
// ---------------------------------------------------------------------------
const badTypeof = (val: unknown) => typeof val === 'strig';

// ---------------------------------------------------------------------------
// no-inner-declarations
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
// no-control-regex
//   Don't use control characters in regex
// ---------------------------------------------------------------------------
const controlRegex = new RegExp('\x01');

// ---------------------------------------------------------------------------
// no-empty-character-class
//   Empty character class in regex
// ---------------------------------------------------------------------------
const emptyCharClass = /^abc[]/;

// ---------------------------------------------------------------------------
// no-invalid-regexp
//   Invalid regex
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// no-regex-spaces
//   Multiple spaces in regex
// ---------------------------------------------------------------------------
const multiSpaceRegex = /foo   bar/;

// ---------------------------------------------------------------------------
// no-misleading-character-class
//   Misleading character class (combined chars)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// no-useless-backreference
//   Backreference that will always be empty
// ---------------------------------------------------------------------------
const uselessBackref = /(?:a)|(b)\1/;

// ---------------------------------------------------------------------------
// no-octal
//   Octal literals
// ---------------------------------------------------------------------------
// const octal = 071; // TypeScript prevents this in strict mode

// ---------------------------------------------------------------------------
// no-octal-escape
//   Octal escape sequences in strings
// ---------------------------------------------------------------------------
// const octalEscape = '\251'; // TypeScript prevents in strict mode

// ---------------------------------------------------------------------------
// prefer-destructuring
//   VariableDeclarator: object=true (must destructure object property)
//   AssignmentExpression: array=true
// ---------------------------------------------------------------------------
const obj = { name: 'test', age: 30 };
const name = obj.name;

// ---------------------------------------------------------------------------
// prefer-spread
//   Use spread instead of apply
// ---------------------------------------------------------------------------
const numbers = [1, 2, 3];
const maxNum = Math.max.apply(Math, numbers);

// ---------------------------------------------------------------------------
// no-loop-func
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
// global-require
//   require() should be at top level
// ---------------------------------------------------------------------------
const lazyRequire = () => {
  const mod = require('path');
  return mod;
};

// ---------------------------------------------------------------------------
// no-new-require
//   Don't use new require()
// ---------------------------------------------------------------------------
// const req = new require('path'); // TS prevents this

// ---------------------------------------------------------------------------
// no-path-concat
//   Don't concatenate __dirname with string
// ---------------------------------------------------------------------------
// const fullPath = __dirname + '/file.txt'; // Only valid in CJS

// ---------------------------------------------------------------------------
// new-cap
//   newIsCap: true → new must be used with capitalized function
// ---------------------------------------------------------------------------
const myConstructor = function myConstructor() {} as unknown as new () => object;
const thing = new myConstructor();

// ---------------------------------------------------------------------------
// grouped-accessor-pairs
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
// no-class-assign
//   Don't reassign a class
// ---------------------------------------------------------------------------
class ReassignedClass {}
// ReassignedClass = class {}; // TS prevents const reassignment

// ---------------------------------------------------------------------------
// no-extend-native
//   Don't extend native prototypes
// ---------------------------------------------------------------------------
Object.defineProperty(Array.prototype, 'customFlat', {
  value: () => [],
});

// ---------------------------------------------------------------------------
// no-nonoctal-decimal-escape
//   Don't use \8 or \9 escape in strings
// ---------------------------------------------------------------------------
// const nonoctal = '\8'; // Strict mode prevents this

// ---------------------------------------------------------------------------
// require-yield
//   Generator must have yield
// ---------------------------------------------------------------------------
function* noYield() {
  return 42;
}

// ---------------------------------------------------------------------------
// no-restricted-exports
//   Some export names may be restricted
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// strict
//   'use strict' is unnecessary in ES modules
// ---------------------------------------------------------------------------
// 'use strict'; // Would be at top of file, causing issues with imports

// ---------------------------------------------------------------------------
// no-shadow-restricted-names
//   Don't shadow NaN, Infinity, undefined, etc.
// ---------------------------------------------------------------------------
// const undefined = 'bad'; // TS prevents this

// ---------------------------------------------------------------------------
// no-empty-function
//   allow: arrowFunctions, functions, methods → need getter/setter to trigger
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
  dupeCase,
  emptyPattern,
  exAssign,
  sparse,
  unsafeFinally,
  unsafeOptChain,
  unusedLabel,
  nanCheck,
  badTypeof,
  innerDecl,
  controlRegex,
  emptyCharClass,
  multiSpaceRegex,
  uselessBackref,
  name,
  maxNum,
  loopFn,
  lazyRequire,
  thing,
  groupedAccessor,
  ReassignedClass,
  noYield,
  EmptyGetterClass,
};
