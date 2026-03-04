/* ==========================================================================
 * import/* rules NG examples
 * Source: airbnb / eslint-plugin-import
 * ========================================================================== */

// ---------------------------------------------------------------------------
// import/order
//   External imports must come before internal, with newlines between groups
//   Alphabetically ordered within groups
// ---------------------------------------------------------------------------
import { dummyUtil } from './dummy-util';
import { useState } from 'react';

// ---------------------------------------------------------------------------
// import/extensions
//   Don't include file extensions for js/jsx/ts/tsx
// ---------------------------------------------------------------------------
import About from '../pages/About.tsx';

// ---------------------------------------------------------------------------
// import/no-duplicates
//   Don't import the same module twice
// ---------------------------------------------------------------------------
import { useEffect } from 'react';
import { useCallback } from 'react';

// ---------------------------------------------------------------------------
// import/first
//   Imports must come before any other statements
// ---------------------------------------------------------------------------
const earlyStatement = 'I should not be here before imports';

// ---------------------------------------------------------------------------
// import/newline-after-import
//   Must have empty line after last import
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-mutable-exports
//   Don't export mutable bindings
// ---------------------------------------------------------------------------
export let mutableExport = 'bad';

// ---------------------------------------------------------------------------
// import/no-absolute-path
//   Don't use absolute path imports
// ---------------------------------------------------------------------------
// import something from '/absolute/path'; // would fail resolution too

// ---------------------------------------------------------------------------
// import/no-useless-path-segments
//   Don't use unnecessary path segments like ./foo/../bar
// ---------------------------------------------------------------------------
import { dummyUtil as dup } from './../ng-examples/dummy-util';

// ---------------------------------------------------------------------------
// import/no-webpack-loader-syntax
//   Don't use webpack loader syntax
// ---------------------------------------------------------------------------
// import styles from '!style-loader!css-loader!./styles.css';
// (commented out because it would fail resolution)

// ---------------------------------------------------------------------------
// import/no-named-default
//   Don't import default as named
// ---------------------------------------------------------------------------
// (hard to demonstrate without a specific module that exports default)

// ---------------------------------------------------------------------------
// import/no-self-import
//   A module must not import itself
// ---------------------------------------------------------------------------
// import self from './05-import-ng'; // would cause circular

// ---------------------------------------------------------------------------
// import/no-cycle
//   Circular imports are banned
// ---------------------------------------------------------------------------
// (requires two files to demonstrate)

// ---------------------------------------------------------------------------
// import/no-extraneous-dependencies
//   Don't import packages not in dependencies
// ---------------------------------------------------------------------------
// import _ from 'lodash'; // not in package.json

// ---------------------------------------------------------------------------
// sort-imports (core rule)
//   Members within import must be alphabetically sorted
// ---------------------------------------------------------------------------
import { Route, Link, Routes } from 'react-router';

// ---------------------------------------------------------------------------
// unused-imports/no-unused-imports (warn)
//   Remove unused imports
// ---------------------------------------------------------------------------

const ImportDemo = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {}, []);
  useCallback(() => {}, []);
  return (
    <div>
      <About />
      <p>{dummyUtil()}</p>
      <p>{dup()}</p>
      <p>{count}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
};

export { earlyStatement, ImportDemo, Route, Link, Routes };
