/* ==========================================================================
 * Remaining import/* rules NG examples
 * ========================================================================== */

// ---------------------------------------------------------------------------
// import/no-absolute-path
//   Don't use absolute path imports
// ---------------------------------------------------------------------------
// import abs from '/absolute'; // Would fail resolution

// ---------------------------------------------------------------------------
// import/newline-after-import
//   Must have empty line after last import
// ---------------------------------------------------------------------------
import { dummyUtil } from './dummy-util';
const noNewline = dummyUtil();

// ---------------------------------------------------------------------------
// import/no-amd
//   Don't use AMD define/require
// ---------------------------------------------------------------------------
// define(['dep'], function(dep) {}); // Only in JS/CJS context

// ---------------------------------------------------------------------------
// import/no-webpack-loader-syntax
//   Don't use webpack ! loader syntax
// ---------------------------------------------------------------------------
// import styles from '!css-loader!./style.css'; // Fails resolution

// ---------------------------------------------------------------------------
// import/no-dynamic-require
//   Don't use dynamic require()
// ---------------------------------------------------------------------------
const dynamicReq = (name: string) => require(name);

// ---------------------------------------------------------------------------
// import/no-self-import
//   Module should not import itself
// ---------------------------------------------------------------------------
// import self from './10-remaining-import-ng'; // Would cause issues

// ---------------------------------------------------------------------------
// import/no-cycle
//   Circular dependency
//   (requires 2+ files referencing each other)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-extraneous-dependencies
//   Import a package not listed in package.json dependencies
// ---------------------------------------------------------------------------
// import _ from 'lodash'; // lodash is not in deps

// ---------------------------------------------------------------------------
// import/no-import-module-exports
//   Don't mix import with module.exports
// ---------------------------------------------------------------------------
// (would need module.exports at bottom, which conflicts with ESM)

// ---------------------------------------------------------------------------
// import/no-named-as-default
//   Don't import default export by its named export name
//   (requires specific module structure to demonstrate)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-named-as-default-member
//   Don't access named export as property of default
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-named-default
//   Don't use named default import
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-relative-packages
//   Don't use relative paths to import from packages
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/export
//   No invalid exports (e.g. duplicate default export)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// import/no-unresolved
//   Import must resolve to a module
// ---------------------------------------------------------------------------

export { noNewline, dynamicReq };
