/* ==========================================================================
 * import/* rules NG examples
 * Source: airbnb / eslint-plugin-import
 * ========================================================================== */
const beforeImports = 1;
// ---------------------------------------------------------------------------
// Import/order
// ---------------------------------------------------------------------------
import { useState } from 'react';

// ---------------------------------------------------------------------------
// Import/extensions
//   Don't include file extensions for js/jsx/ts/tsx
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-duplicates
//   Don't import the same module twice
// ---------------------------------------------------------------------------
import { useEffect } from 'react';
import { useCallback } from 'react';

// ---------------------------------------------------------------------------
// Import/no-absolute-path
//   Don't use absolute path imports
// ---------------------------------------------------------------------------
// Import something from '/absolute/path'; // would fail resolution too

// ---------------------------------------------------------------------------
// Import/no-useless-path-segments
//   Don't use unnecessary path segments like ./foo/../bar
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-webpack-loader-syntax
//   Don't use webpack loader syntax
// ---------------------------------------------------------------------------
import '!style-loader!css-loader!./dummy-styles.css';

// ---------------------------------------------------------------------------
// Import/no-named-default
//   Don't import default as named
// ---------------------------------------------------------------------------
// (hard to demonstrate without a specific module that exports default)

// ---------------------------------------------------------------------------
// Import/no-self-import
//   A module must not import itself
// ---------------------------------------------------------------------------
// Import self from './05-import-ng'; // would cause circular

// ---------------------------------------------------------------------------
// Import/no-cycle
//   Circular imports are banned
// ---------------------------------------------------------------------------
// (requires two files to demonstrate)

// ---------------------------------------------------------------------------
// Import/no-extraneous-dependencies
//   Don't import packages not in dependencies
// ---------------------------------------------------------------------------
// Import _ from 'lodash'; // not in package.json

// ---------------------------------------------------------------------------
// Sort-imports (core rule)
//   Members within import must be alphabetically sorted
// ---------------------------------------------------------------------------
import { Link, Route, Routes } from 'react-router';

import About from '../pages/About.tsx';

import { dummyUtil , dummyUtil as dup } from './dummy-util.ts';
const afterImportNoNewline = 1;
// ---------------------------------------------------------------------------
// Import/no-useless-path-segments - redundant ./ in path
// ---------------------------------------------------------------------------
import { dummyUtil as dummyUtil2 } from '././dummy-util.ts';

// ---------------------------------------------------------------------------
// Import/first / Import/newline-after-import (afterImportNoNewline has no newline before it)
// ---------------------------------------------------------------------------
const earlyStatement = 'I should not be here before imports';

// ---------------------------------------------------------------------------
// Import/no-mutable-exports
//   Don't export mutable bindings
// ---------------------------------------------------------------------------
export const mutableExport = 'bad';

// ---------------------------------------------------------------------------
// Unused-imports/no-unused-imports (warn)
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

export { beforeImports, afterImportNoNewline, dummyUtil2, earlyStatement, ImportDemo, Route, Link, Routes };
