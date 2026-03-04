/* ==========================================================================
 * Remaining import/* rules NG examples
 * ========================================================================== */

// ---------------------------------------------------------------------------
// Import/no-absolute-path
//   Don't use absolute path imports
// ---------------------------------------------------------------------------
// Import abs from '/absolute'; // Would fail resolution

// ---------------------------------------------------------------------------
// Import/newline-after-import
//   Must have empty line after last import
// ---------------------------------------------------------------------------
import { dummyUtil } from './dummy-util.ts';

const noNewline = dummyUtil();

// ---------------------------------------------------------------------------
// Import/no-amd
//   Don't use AMD define/require
// ---------------------------------------------------------------------------
// Define(['dep'], function(dep) {}); // Only in JS/CJS context

// ---------------------------------------------------------------------------
// Import/no-webpack-loader-syntax
//   Don't use webpack ! loader syntax
// ---------------------------------------------------------------------------
// Import styles from '!css-loader!./style.css'; // Fails resolution

// ---------------------------------------------------------------------------
// Import/no-dynamic-require
//   Don't use dynamic require()
// ---------------------------------------------------------------------------
const dynamicReq = (name: string) => require(name);

// ---------------------------------------------------------------------------
// Import/no-self-import
//   Module should not import itself
// ---------------------------------------------------------------------------
// Import self from './10-remaining-import-ng'; // Would cause issues

// ---------------------------------------------------------------------------
// Import/no-cycle
//   Circular dependency
//   (requires 2+ files referencing each other)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-extraneous-dependencies
//   Import a package not listed in package.json dependencies
// ---------------------------------------------------------------------------
// Import _ from 'lodash'; // lodash is not in deps

// ---------------------------------------------------------------------------
// Import/no-import-module-exports
//   Don't mix import with module.exports
// ---------------------------------------------------------------------------
// (would need module.exports at bottom, which conflicts with ESM)

// ---------------------------------------------------------------------------
// Import/no-named-as-default
//   Don't import default export by its named export name
//   (requires specific module structure to demonstrate)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-named-as-default-member
//   Don't access named export as property of default
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-named-default
//   Don't use named default import
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-relative-packages
//   Don't use relative paths to import from packages
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/export
//   No invalid exports (e.g. duplicate default export)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Import/no-unresolved
//   Import must resolve to a module
// ---------------------------------------------------------------------------

export { noNewline, dynamicReq };
