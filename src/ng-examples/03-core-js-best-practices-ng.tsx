/* ==========================================================================
 * Core JS rules NG examples - Best Practices & Statements
 * Source: airbnb / eslint:recommended
 * ========================================================================== */

// ---------------------------------------------------------------------------
// Eqeqeq
// ---------------------------------------------------------------------------
const loose = (a: string) => a == 'test';

// ---------------------------------------------------------------------------
// No-eval
// ---------------------------------------------------------------------------
const evalUsage = () => eval('1 + 1');

// ---------------------------------------------------------------------------
// No-implied-eval
//   SetTimeout/setInterval with string argument
// ---------------------------------------------------------------------------
const impliedEval = () => setTimeout('alert("hi")', 100);

// ---------------------------------------------------------------------------
// No-alert
// ---------------------------------------------------------------------------
const alertUsage = () => alert('oops');

// ---------------------------------------------------------------------------
// No-console
// ---------------------------------------------------------------------------
const consoleUsage = () => {
  console.log('debug');
  console.warn('warning');
  console.error('error');
};

// ---------------------------------------------------------------------------
// No-debugger
// ---------------------------------------------------------------------------
const debuggerUsage = () => 1;

// ---------------------------------------------------------------------------
// No-param-reassign
//   Reassigning function parameters or their properties
// ---------------------------------------------------------------------------
const paramReassign = (obj: { count: number }) => {
  obj.count = 99;
  return obj;
};

// ---------------------------------------------------------------------------
// No-return-assign
//   Assignment in return statement
// ---------------------------------------------------------------------------
const returnAssign = () => {
  let val = 0;
  const fn = () => (val = 5);
  return fn();
};

// ---------------------------------------------------------------------------
// No-return-await
//   Unnecessary return await
// ---------------------------------------------------------------------------
const returnAwait = async () => {
  const fetchData = async () => 'data';
  return await fetchData();
};

// ---------------------------------------------------------------------------
// Consistent-return
//   Function sometimes returns a value and sometimes doesn't
// ---------------------------------------------------------------------------
const inconsistentReturn = (flag: boolean) => {
  if (flag) {
    return 'yes';
  }
};

// ---------------------------------------------------------------------------
// Array-callback-return
//   Array method callbacks must return
// ---------------------------------------------------------------------------
const noReturn = [1, 2, 3].map((n) => {
  const doubled = n * 2;
});

// ---------------------------------------------------------------------------
// Default-case
//   Switch must have default case
// ---------------------------------------------------------------------------
const noDefault = (val: string) => {
  switch (val) {
    case 'a':
      return 1;
    case 'b':
      return 2;
  }
};

// ---------------------------------------------------------------------------
// Default-case-last
//   Default case must be last
// ---------------------------------------------------------------------------
const defaultNotLast = (val: string) => {
  switch (val) {
    default:
      return 0;
    case 'a':
      return 1;
  }
};

// ---------------------------------------------------------------------------
// Default-param-last
//   Default parameters must be last
// ---------------------------------------------------------------------------
const defaultNotLastParam = (a = 1, b: number) => a + b;

// ---------------------------------------------------------------------------
// No-fallthrough
//   Switch case without break
// ---------------------------------------------------------------------------
const fallthrough = (val: number) => {
  let result = '';
  switch (val) {
    case 1:
      result += 'one';
    case 2:
      result += 'two';
      break;
    default:
      break;
  }
  return result;
};

// ---------------------------------------------------------------------------
// Guard-for-in
//   For-in must have hasOwnProperty check
// ---------------------------------------------------------------------------
const forInNoGuard = (obj: Record<string, number>) => {
  for (const key in obj) {
    console.log(key);
  }
};

// ---------------------------------------------------------------------------
// No-restricted-syntax
//   For-in, for-of, labels, with are restricted by airbnb
// ---------------------------------------------------------------------------
const restrictedForOf = (arr: number[]) => {
  for (const item of arr) {
    console.log(item);
  }
};

// ---------------------------------------------------------------------------
// No-loop-func
//   Function created inside a loop
// ---------------------------------------------------------------------------
const loopFunc = () => {
  const fns: (() => number)[] = [];
  for (let i = 0; i < 5; i++) {
    fns.push(() => i);
  }
  return fns;
};

// ---------------------------------------------------------------------------
// No-await-in-loop
//   Await inside a loop
// ---------------------------------------------------------------------------
const awaitInLoop = async (urls: string[]) => {
  const results: string[] = [];
  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i]);
    results.push(await res.text());
  }
  return results;
};

// ---------------------------------------------------------------------------
// No-promise-executor-return
//   Don't return inside promise executor
// ---------------------------------------------------------------------------
const promiseReturn = new Promise((resolve) => resolve(42));

// ---------------------------------------------------------------------------
// No-constructor-return
//   Don't return from constructor
// ---------------------------------------------------------------------------
class BadConstructor {
  constructor() {
    return { oops: true } as unknown as BadConstructor;
  }
}

// ---------------------------------------------------------------------------
// No-throw-literal
//   Throw an Error object, not a literal
// ---------------------------------------------------------------------------
const throwLiteral = () => {
  throw 'error string';
};

// ---------------------------------------------------------------------------
// Prefer-promise-reject-errors
//   Reject with an Error object
// ---------------------------------------------------------------------------
const badReject = () => Promise.reject('not an error');

// ---------------------------------------------------------------------------
// Radix
//   ParseInt must have radix argument
// ---------------------------------------------------------------------------
const noRadix = Number.parseInt('10');

// ---------------------------------------------------------------------------
// No-void
//   Don't use void operator
// ---------------------------------------------------------------------------
const voidUsage = () => {
  void 0;
};

// ---------------------------------------------------------------------------
// No-sequences
//   Don't use comma operator
// ---------------------------------------------------------------------------
const commaOperator = () => (1, 2, 3);

// ---------------------------------------------------------------------------
// No-unused-expressions
//   Expression that doesn't do anything
// ---------------------------------------------------------------------------
const unusedExpr = () => {
  const val = 5;
  val;
};

// ---------------------------------------------------------------------------
// No-useless-catch
//   Catch that just re-throws
// ---------------------------------------------------------------------------
const uselessCatch = async () => {
  try {
    await fetch('/api');
  } catch (e) {
    throw e;
  }
};

// ---------------------------------------------------------------------------
// No-useless-return
//   Unnecessary return at end of function
// ---------------------------------------------------------------------------
const uselessReturn = () => {
  console.log('done');
  
};

// ---------------------------------------------------------------------------
// No-useless-concat
//   Unnecessary string concatenation of literals
// ---------------------------------------------------------------------------
const uselessConcat = "hello world";

// ---------------------------------------------------------------------------
// No-self-compare
//   Comparing a value to itself
// ---------------------------------------------------------------------------
const selfCompare = (val: number) => val === val;

// ---------------------------------------------------------------------------
// No-self-assign
//   Assigning a variable to itself
// ---------------------------------------------------------------------------
let selfAssignVal = 5;
selfAssignVal = selfAssignVal;

// ---------------------------------------------------------------------------
// No-extend-native
//   Don't modify native prototypes
// ---------------------------------------------------------------------------
(Array.prototype as Record<string, unknown>).customMethod = () => {};

// ---------------------------------------------------------------------------
// No-iterator
//   Don't use __iterator__
// ---------------------------------------------------------------------------
const iteratorProp = {} as Record<string, unknown>;
iteratorProp.__iterator__ = () => {};

// ---------------------------------------------------------------------------
// No-proto
//   Don't use __proto__
// ---------------------------------------------------------------------------
const protoUsage = {} as Record<string, unknown>;
const parent = protoUsage.__proto__;

// ---------------------------------------------------------------------------
// No-caller
//   Don't use arguments.caller or arguments.callee
// ---------------------------------------------------------------------------
const callerUsage = () => arguments.callee;

// ---------------------------------------------------------------------------
// No-new
//   Don't use new for side effects
// ---------------------------------------------------------------------------
class SideEffect {
  constructor() {
    console.log('created');
  }
}
const newSideEffect = () => {
  new SideEffect();
};

// ---------------------------------------------------------------------------
// No-new-func
//   Don't use new Function()
// ---------------------------------------------------------------------------
const dynamicFn = new Function('a', 'b', 'return a + b');

// ---------------------------------------------------------------------------
// No-new-wrappers
//   Don't use new String(), new Number(), new Boolean()
// ---------------------------------------------------------------------------
const wrappedString = 'hello';
const wrappedNumber = 42;
const wrappedBool = true;

// ---------------------------------------------------------------------------
// No-new-object
//   Don't use new Object()
// ---------------------------------------------------------------------------
const objConstructor = new Object();

// ---------------------------------------------------------------------------
// No-script-url
//   Don't use javascript: URLs
// ---------------------------------------------------------------------------
const scriptUrl = () => <a href="javascript:void(0)">link</a>;

// ---------------------------------------------------------------------------
// No-extra-bind
//   Unnecessary .bind()
// ---------------------------------------------------------------------------
const extraBind = (() => 42);

// ---------------------------------------------------------------------------
// No-extra-label
//   Unnecessary label
// ---------------------------------------------------------------------------
const extraLabel = () => {
  while (true) {
    break;
  }
};

// ---------------------------------------------------------------------------
// No-labels
//   Don't use labels
// ---------------------------------------------------------------------------
const labelsUsage = () => {
  for (let i = 0; i < 5; i++) {
    break;
  }
};

// ---------------------------------------------------------------------------
// No-lone-blocks
//   Unnecessary block
// ---------------------------------------------------------------------------
const loneBlock = () => {
  {
    const temp = 1;
  }
};

// ---------------------------------------------------------------------------
// No-case-declarations
//   Declarations in case without block
// ---------------------------------------------------------------------------
const caseDecl = (val: number) => {
  switch (val) {
    case 1: {
      const msg = 'one';
      return msg;
    }
    default:
      return '';
  }
};

// ---------------------------------------------------------------------------
// No-empty
//   Empty block statement
// ---------------------------------------------------------------------------
const emptyBlock = () => {
  try {
    JSON.parse('invalid');
  } catch (e) {}
};

// ---------------------------------------------------------------------------
// No-empty-function
//   Empty function body
// ---------------------------------------------------------------------------
const emptyFn = () => {};

// ---------------------------------------------------------------------------
// No-extra-boolean-cast
//   Unnecessary boolean cast
// ---------------------------------------------------------------------------
const extraBoolCast = (val: string) => {
  if (val) {
    return true;
  }
  return false;
};

// ---------------------------------------------------------------------------
// No-prototype-builtins
//   Don't call prototype methods directly on objects
// ---------------------------------------------------------------------------
const protoBuiltin = (obj: Record<string, unknown>) => Object.hasOwn(obj, 'key');

// ---------------------------------------------------------------------------
// Class-methods-use-this
//   Class methods that don't use `this` should be static
// ---------------------------------------------------------------------------
class NoThisMethod {
  greet() {
    return 'hello';
  }
}

// ---------------------------------------------------------------------------
// Max-classes-per-file
//   Only one class per file (already violated by multiple class examples)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// No-useless-constructor
//   Unnecessary constructor
// ---------------------------------------------------------------------------
class UselessConstructor {
  
}

// ---------------------------------------------------------------------------
// No-useless-computed-key
//   Unnecessary computed property key
// ---------------------------------------------------------------------------
const computedKey = { 'name': 'value' };

// ---------------------------------------------------------------------------
// No-useless-rename
//   Unnecessary rename in destructuring
// ---------------------------------------------------------------------------
const { toString } = Object.prototype;

export {
  loose,
  evalUsage,
  impliedEval,
  alertUsage,
  consoleUsage,
  debuggerUsage,
  paramReassign,
  returnAssign,
  returnAwait,
  inconsistentReturn,
  noReturn,
  noDefault,
  defaultNotLast,
  defaultNotLastParam,
  fallthrough,
  forInNoGuard,
  restrictedForOf,
  loopFunc,
  awaitInLoop,
  promiseReturn,
  BadConstructor,
  throwLiteral,
  badReject,
  noRadix,
  voidUsage,
  commaOperator,
  unusedExpr,
  uselessCatch,
  uselessReturn,
  uselessConcat,
  selfCompare,
  selfAssignVal,
  iteratorProp,
  parent,
  callerUsage,
  newSideEffect,
  dynamicFn,
  wrappedString,
  wrappedNumber,
  wrappedBool,
  objConstructor,
  scriptUrl,
  extraBind,
  extraLabel,
  labelsUsage,
  loneBlock,
  caseDecl,
  emptyBlock,
  emptyFn,
  extraBoolCast,
  protoBuiltin,
  NoThisMethod,
  UselessConstructor,
  computedKey,
  toString,
};
