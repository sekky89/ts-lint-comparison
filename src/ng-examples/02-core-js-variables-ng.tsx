/* ==========================================================================
 * Core JS rules NG examples - Variables, Naming, Declarations
 * Source: airbnb / eslint:recommended
 * ========================================================================== */

// ---------------------------------------------------------------------------
// no-var
// ---------------------------------------------------------------------------
const mutableVar = 'bad';

// ---------------------------------------------------------------------------
// prefer-const
// ---------------------------------------------------------------------------
const neverReassigned = 'should be const';

// ---------------------------------------------------------------------------
// no-undef-init
//   Don't initialize to undefined explicitly
// ---------------------------------------------------------------------------
const explicitUndefined = undefined;

// ---------------------------------------------------------------------------
// one-var
//   Each variable must have its own declaration
// ---------------------------------------------------------------------------
const oneA = 1;
  const oneB = 2;

// ---------------------------------------------------------------------------
// vars-on-top
//   var declarations should be at the top of their scope
// ---------------------------------------------------------------------------
const varsOnTopDemo = () => {
  const x = 1;
  if (x) {
    var hoisted = 2;
  }
  return hoisted;
};

// ---------------------------------------------------------------------------
// block-scoped-var
//   var used outside of the block it was defined in
// ---------------------------------------------------------------------------
const blockScopedDemo = () => {
  if (true) {
    var blockVar = 'oops';
  }
  return blockVar;
};

// ---------------------------------------------------------------------------
// no-shadow
//   Variable shadows an outer scope variable
// ---------------------------------------------------------------------------
const shadowedName = 'outer';
const shadowDemo = () => {
  const shadowedName = 'inner';
  return shadowedName;
};

// ---------------------------------------------------------------------------
// camelcase
//   Use camelCase naming
// ---------------------------------------------------------------------------
const my_snake_case = 'bad naming';

// ---------------------------------------------------------------------------
// no-underscore-dangle
//   No dangling underscores
// ---------------------------------------------------------------------------
const _privateThing = 'secret';

// ---------------------------------------------------------------------------
// new-cap
//   Constructors must be capitalized; non-constructors must not be
// ---------------------------------------------------------------------------
const badConstructor = () => ({ value: 1 });
const instance = new (badConstructor as unknown as new () => { value: number })();

// ---------------------------------------------------------------------------
// no-multi-assign
//   No chained assignments
// ---------------------------------------------------------------------------
const multiAssign = () => {
  let a;
  let b;
  a = b = 5;
  return a + b;
};

// ---------------------------------------------------------------------------
// no-delete-var
//   Don't delete variables (only properties)
// ---------------------------------------------------------------------------
const deletable = 'gone';
delete (deletable as unknown as Record<string, unknown>);

// ---------------------------------------------------------------------------
// no-label-var
//   Label must not share name with variable
// ---------------------------------------------------------------------------
const x = 1;
x: {
  break x;
}

// ---------------------------------------------------------------------------
// no-restricted-globals
//   Certain globals are restricted (e.g., event, name, length)
// ---------------------------------------------------------------------------
const restrictedGlobal = () => {
  const check = isNaN(123);
  return check;
};

// ---------------------------------------------------------------------------
// symbol-description
//   Symbol must have a description
// ---------------------------------------------------------------------------
const noDescSymbol = Symbol();

// ---------------------------------------------------------------------------
// no-shadow-restricted-names
//   Don't shadow restricted names like undefined, NaN
//   (TypeScript may prevent some of these, but ESLint still checks)
// ---------------------------------------------------------------------------

export {
  mutableVar,
  neverReassigned,
  explicitUndefined,
  oneA,
  oneB,
  varsOnTopDemo,
  blockScopedDemo,
  shadowDemo,
  my_snake_case,
  _privateThing,
  instance,
  multiAssign,
  deletable,
  x,
  restrictedGlobal,
  noDescSymbol,
};
