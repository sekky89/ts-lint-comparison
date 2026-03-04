/* ==========================================================================
 * Core JS rules NG examples - Style & Syntax Preferences
 * Source: airbnb
 * ========================================================================== */

// ---------------------------------------------------------------------------
// prefer-template
//   Use template literals instead of string concatenation
// ---------------------------------------------------------------------------
const greeting = (name: string) => 'Hello, ' + name + '!';

// ---------------------------------------------------------------------------
// no-nested-ternary
// ---------------------------------------------------------------------------
const classify = (x: number) => (x > 10 ? 'big' : x > 5 ? 'mid' : 'small');

// ---------------------------------------------------------------------------
// no-unneeded-ternary
//   Unnecessary ternary when boolean expression suffices
// ---------------------------------------------------------------------------
const boolTernary = (val: boolean) => (val ? true : false);

// ---------------------------------------------------------------------------
// no-plusplus
// ---------------------------------------------------------------------------
const incrementDemo = () => {
  let val = 0;
  val++;
  return val;
};

// ---------------------------------------------------------------------------
// no-bitwise
//   Bitwise operators are error-prone
// ---------------------------------------------------------------------------
const bitwiseOr = (a: number, b: number) => a | b;
const bitwiseAnd = (a: number, b: number) => a & b;

// ---------------------------------------------------------------------------
// no-continue
//   Don't use continue statement
// ---------------------------------------------------------------------------
const continueDemo = (arr: number[]) => {
  const results: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 0) continue;
    results.push(arr[i]);
  }
  return results;
};

// ---------------------------------------------------------------------------
// no-lonely-if
//   if inside else should be else-if
// ---------------------------------------------------------------------------
const lonelyIf = (a: boolean, b: boolean) => {
  if (a) {
    return 1;
  } else {
    if (b) {
      return 2;
    }
  }
  return 0;
};

// ---------------------------------------------------------------------------
// no-else-return
//   Unnecessary else after return
// ---------------------------------------------------------------------------
const elseReturn = (val: boolean) => {
  if (val) {
    return 'yes';
  } else {
    return 'no';
  }
};

// ---------------------------------------------------------------------------
// no-multi-str
//   Multiline string with backslash
// ---------------------------------------------------------------------------
const multilineStr =
  'hello \
world';

// ---------------------------------------------------------------------------
// no-template-curly-in-string
//   Template literal syntax in regular string
// ---------------------------------------------------------------------------
const templateInStr = '${name} is here';

// ---------------------------------------------------------------------------
// arrow-body-style
//   Unnecessary block body in arrow function
// ---------------------------------------------------------------------------
const arrowBlock = (x: number) => {
  return x * 2;
};

// ---------------------------------------------------------------------------
// prefer-arrow-callback
//   Use arrow function instead of function expression in callbacks
// ---------------------------------------------------------------------------
const mapped = [1, 2, 3].map(function double(n) {
  return n * 2;
});

// ---------------------------------------------------------------------------
// prefer-destructuring
//   Use destructuring instead of member access
// ---------------------------------------------------------------------------
const destructArr = [1, 2, 3];
const firstItem = destructArr[0];

const destructObj = { name: 'Alice', age: 30 };
const personName = destructObj.name;

// ---------------------------------------------------------------------------
// object-shorthand
//   Use shorthand property/method syntax
// ---------------------------------------------------------------------------
const shorthandName = 'world';
const longhand = { shorthandName: shorthandName };

const methodLonghand = {
  greet: function () {
    return 'hi';
  },
};

// ---------------------------------------------------------------------------
// dot-notation
//   Use dot notation instead of bracket when possible
// ---------------------------------------------------------------------------
const dotObj = { name: 'test' };
const dotAccess = dotObj['name'];

// ---------------------------------------------------------------------------
// operator-assignment
//   Use shorthand assignment (+=, -=, etc.)
// ---------------------------------------------------------------------------
const operatorAssign = () => {
  let count = 0;
  count = count + 1;
  return count;
};

// ---------------------------------------------------------------------------
// prefer-exponentiation-operator
//   Use ** instead of Math.pow
// ---------------------------------------------------------------------------
const powResult = Math.pow(2, 10);

// ---------------------------------------------------------------------------
// prefer-spread
//   Use spread instead of .apply()
// ---------------------------------------------------------------------------
const nums = [1, 2, 3];
const maxVal = Math.max.apply(null, nums);

// ---------------------------------------------------------------------------
// prefer-rest-params
//   Use rest params instead of arguments
// ---------------------------------------------------------------------------
function restDemo() {
  return arguments;
}

// ---------------------------------------------------------------------------
// prefer-object-spread
//   Use spread instead of Object.assign
// ---------------------------------------------------------------------------
const merged = Object.assign({}, { a: 1 }, { b: 2 });

// ---------------------------------------------------------------------------
// prefer-numeric-literals
//   Use 0b, 0o, 0x instead of parseInt for binary/octal/hex
// ---------------------------------------------------------------------------
const binary = parseInt('111', 2);

// ---------------------------------------------------------------------------
// prefer-regex-literals
//   Use regex literal instead of new RegExp()
// ---------------------------------------------------------------------------
const regex = new RegExp('abc');

// ---------------------------------------------------------------------------
// spaced-comment
//   Comments must have a space after // or /*
// ---------------------------------------------------------------------------
//no space after double-slash

// ---------------------------------------------------------------------------
// yoda
//   Don't use yoda conditions
// ---------------------------------------------------------------------------
const yodaCheck = (val: number) => {
  if (1 === val) {
    return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// no-restricted-properties
//   Some property accesses are restricted (e.g. Math.pow → use **)
//   (already shown via prefer-exponentiation-operator)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// lines-between-class-members
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
// func-names (warn)
//   Function expression should have a name
// ---------------------------------------------------------------------------
const funcExpr = function () {
  return 42;
};

// ---------------------------------------------------------------------------
// strict
//   strict mode directive is unnecessary in ESM
//   (NOTE: in modules this is already implied, so rule warns if present)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// no-constant-condition (warn)
//   Constant value in condition
// ---------------------------------------------------------------------------
const constantCond = () => {
  if (true) {
    return 'always';
  }
  return 'never';
};

// ---------------------------------------------------------------------------
// no-useless-escape
//   Unnecessary escape character
// ---------------------------------------------------------------------------
const uselessEscape = 'hello\!';

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
