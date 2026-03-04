/* ==========================================================================
 * Core JS rules NG examples - Style & Syntax Preferences
 * Source: airbnb
 * ========================================================================== */

// ---------------------------------------------------------------------------
// Prefer-template
//   Use template literals instead of string concatenation
// ---------------------------------------------------------------------------
const greeting = (name: string) => `Hello, ${  name  }!`;

// ---------------------------------------------------------------------------
// No-nested-ternary
// ---------------------------------------------------------------------------
const classify = (x: number) => (x > 10 ? 'big' : x > 5 ? 'mid' : 'small');

// ---------------------------------------------------------------------------
// No-unneeded-ternary
//   Unnecessary ternary when boolean expression suffices
// ---------------------------------------------------------------------------
const boolTernary = (val: boolean) => (Boolean(val));

// ---------------------------------------------------------------------------
// No-plusplus
// ---------------------------------------------------------------------------
const incrementDemo = () => {
  let val = 0;
  val++;
  return val;
};

// ---------------------------------------------------------------------------
// No-bitwise
//   Bitwise operators are error-prone
// ---------------------------------------------------------------------------
const bitwiseOr = (a: number, b: number) => a | b;
const bitwiseAnd = (a: number, b: number) => a & b;

// ---------------------------------------------------------------------------
// No-continue
//   Don't use continue statement
// ---------------------------------------------------------------------------
const continueDemo = (arr: number[]) => {
  const results: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) {continue;}
    results.push(arr[i]);
  }
  return results;
};

// ---------------------------------------------------------------------------
// No-lonely-if
//   If inside else should be else-if
// ---------------------------------------------------------------------------
const lonelyIf = (a: boolean, b: boolean) => {
  if (a) {
    return 1;
  } 
    if (b) {
      return 2;
    }
  
  return 0;
};

// ---------------------------------------------------------------------------
// No-else-return
//   Unnecessary else after return
// ---------------------------------------------------------------------------
const elseReturn = (val: boolean) => {
  if (val) {
    return 'yes';
  } 
    return 'no';
  
};

// ---------------------------------------------------------------------------
// No-multi-str
//   Multiline string with backslash
// ---------------------------------------------------------------------------
const multilineStr =
  'hello \
world';

// ---------------------------------------------------------------------------
// No-template-curly-in-string
//   Template literal syntax in regular string
// ---------------------------------------------------------------------------
const templateInStr = '${name} is here';

// ---------------------------------------------------------------------------
// Arrow-body-style
//   Unnecessary block body in arrow function
// ---------------------------------------------------------------------------
const arrowBlock = (x: number) => x * 2;

// ---------------------------------------------------------------------------
// Prefer-arrow-callback
//   Use arrow function instead of function expression in callbacks
// ---------------------------------------------------------------------------
const mapped = [1, 2, 3].map((n) => n * 2);

// ---------------------------------------------------------------------------
// Prefer-destructuring
//   Use destructuring instead of member access
// ---------------------------------------------------------------------------
const destructArr = [1, 2, 3];
const firstItem = destructArr[0];

const destructObj = { age: 30, name: 'Alice' };
const personName = destructObj.name;

// ---------------------------------------------------------------------------
// Object-shorthand
//   Use shorthand property/method syntax
// ---------------------------------------------------------------------------
const shorthandName = 'world';
const longhand = { shorthandName };

const methodLonghand = {
  greet () {
    return 'hi';
  },
};

// ---------------------------------------------------------------------------
// Dot-notation
//   Use dot notation instead of bracket when possible
// ---------------------------------------------------------------------------
const dotObj = { name: 'test' };
const dotAccess = dotObj.name;

// ---------------------------------------------------------------------------
// Operator-assignment
//   Use shorthand assignment (+=, -=, etc.)
// ---------------------------------------------------------------------------
const operatorAssign = () => {
  let count = 0;
  count += 1;
  return count;
};

// ---------------------------------------------------------------------------
// Prefer-exponentiation-operator
//   Use ** instead of Math.pow
// ---------------------------------------------------------------------------
const powResult = 2**10;

// ---------------------------------------------------------------------------
// Prefer-spread
//   Use spread instead of .apply()
// ---------------------------------------------------------------------------
const nums = [1, 2, 3];
const maxVal = Math.max.apply(null, nums);

// ---------------------------------------------------------------------------
// Prefer-rest-params
//   Use rest params instead of arguments
// ---------------------------------------------------------------------------
function restDemo() {
  return arguments;
}

// ---------------------------------------------------------------------------
// Prefer-object-spread
//   Use spread instead of Object.assign
// ---------------------------------------------------------------------------
const merged = { a: 1, b: 2};

// ---------------------------------------------------------------------------
// Prefer-numeric-literals
//   Use 0b, 0o, 0x instead of parseInt for binary/octal/hex
// ---------------------------------------------------------------------------
const binary = 0b111;

// ---------------------------------------------------------------------------
// Prefer-regex-literals
//   Use regex literal instead of new RegExp()
// ---------------------------------------------------------------------------
const regex = /abc/;

// ---------------------------------------------------------------------------
// Spaced-comment
//   Comments must have a space after // or /*
// ---------------------------------------------------------------------------
// No space after double-slash

// ---------------------------------------------------------------------------
// Yoda
//   Don't use yoda conditions
// ---------------------------------------------------------------------------
const yodaCheck = (val: number) => {
  if (val === 1) {
    return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// No-restricted-properties
//   Some property accesses are restricted (e.g. Math.pow → use **)
//   (already shown via prefer-exponentiation-operator)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Lines-between-class-members
//   Class members must have empty lines between them
// ---------------------------------------------------------------------------
class NoLinesBetween {
  name = 'test';

  age = 30;

  greet() {
    return this.name;
  }

  farewell() {
    return 'bye';
  }
}

// ---------------------------------------------------------------------------
// Func-names (warn)
//   Function expression should have a name
// ---------------------------------------------------------------------------
const funcExpr = function  funcExpr() {
  return 42;
};

// ---------------------------------------------------------------------------
// Strict
//   Strict mode directive is unnecessary in ESM
//   (NOTE: in modules this is already implied, so rule warns if present)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// No-constant-condition (warn)
//   Constant value in condition
// ---------------------------------------------------------------------------
const constantCond = () => {
  if (true) {
    return 'always';
  }
  return 'never';
};

// ---------------------------------------------------------------------------
// No-useless-escape
//   Unnecessary escape character
// ---------------------------------------------------------------------------
const uselessEscape = 'hello!';

export {
  greeting,
  classify,
  boolTernary,
  incrementDemo,
  bitwiseOr,
  bitwiseAnd,
  continueDemo,
  lonelyIf,
  elseReturn,
  multilineStr,
  templateInStr,
  arrowBlock,
  mapped,
  firstItem,
  personName,
  longhand,
  methodLonghand,
  dotAccess,
  operatorAssign,
  powResult,
  maxVal,
  restDemo,
  merged,
  binary,
  regex,
  yodaCheck,
  NoLinesBetween,
  funcExpr,
  constantCond,
  uselessEscape,
};
