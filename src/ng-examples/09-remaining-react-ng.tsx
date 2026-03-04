/* ==========================================================================
 * Remaining react/* rules NG examples
 * Rules not yet detected in previous files
 * ========================================================================== */
import React from 'react';

// ---------------------------------------------------------------------------
// react/prop-types
//   Missing prop types (triggers with non-TS prop validation)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/jsx-no-undef
//   Using undefined JSX component
// ---------------------------------------------------------------------------
// const UndefinedComp = () => <NonExistent />; // TS would catch this

// ---------------------------------------------------------------------------
// react/no-deprecated
//   Using deprecated React APIs (e.g., UNSAFE_ lifecycle methods)
// ---------------------------------------------------------------------------
class DeprecatedAPI extends React.Component {
  UNSAFE_componentWillMount() {
    console.log('deprecated');
  }

  UNSAFE_componentWillReceiveProps() {
    console.log('deprecated');
  }

  render() {
    return <div>deprecated</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-render-return-value
//   Don't use the return value of ReactDOM.render
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-this-in-sfc
//   Don't use `this` in stateless function component
// ---------------------------------------------------------------------------
const ThisInSfc = function () {
  return <div>{this}</div>;
};

// ---------------------------------------------------------------------------
// react/no-typos
//   Typos in static class properties (e.g., defaultprops vs defaultProps)
// ---------------------------------------------------------------------------
class TypoClass extends React.Component {
  static defaultprops = { name: 'test' };

  render() {
    return <div>typo</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-will-update-set-state
//   Don't setState in componentWillUpdate
// ---------------------------------------------------------------------------
class WillUpdateSetState extends React.Component {
  state = { val: 0 };

  UNSAFE_componentWillUpdate() {
    this.setState({ val: 1 });
  }

  render() {
    return <div>{this.state.val}</div>;
  }
}

// ---------------------------------------------------------------------------
// react/require-render-return
//   render() must return something
// ---------------------------------------------------------------------------
class NoRenderReturn extends React.Component {
  render() {
    console.log('no return');
  }
}

// ---------------------------------------------------------------------------
// react/prefer-es6-class
//   Use ES6 class syntax
// ---------------------------------------------------------------------------
// (createReactClass is not importable in this project)

// ---------------------------------------------------------------------------
// react/prefer-exact-props
//   Use exact props
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/forbid-prop-types
//   Forbid vague prop types (any, array, object)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/static-property-placement
//   Static properties should be in the class body
// ---------------------------------------------------------------------------
class StaticOutside extends React.Component {
  render() {
    return <div>static</div>;
  }
}
StaticOutside.defaultProps = { name: 'default' };

// ---------------------------------------------------------------------------
// react/default-props-match-prop-types
//   defaultProps must match declared prop types
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/forbid-foreign-prop-types (warn)
//   Don't access other components' propTypes
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/jsx-pascal-case
//   Component name used in JSX must be PascalCase
//   (lowercase JSX tags are treated as DOM elements, need uppercase start)
// ---------------------------------------------------------------------------
const My_Bad_Component = () => <div>bad name</div>;
const PascalDemo = () => <My_Bad_Component />;

// ---------------------------------------------------------------------------
// react/no-namespace
//   Don't use namespace in component names (e.g., <Foo:Bar>)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/jsx-uses-vars
//   Variables used in JSX are considered used
//   (This is a helper rule, not really an NG pattern)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/style-prop-object
//   style prop must be an object, not a string
// ---------------------------------------------------------------------------
const StringStyle = () => <div style={'color: red' as unknown as undefined}>text</div>;

// ---------------------------------------------------------------------------
// react/jsx-no-bind
//   allowArrowFunctions: true, ignoreDOMComponents: true
//   → need .bind() on a non-DOM custom component
// ---------------------------------------------------------------------------
const CustomComp = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick}>click</button>
);
const JsxBind = () => {
  const handler = () => {};
  return <CustomComp onClick={handler.bind(null)} />;
};

// ---------------------------------------------------------------------------
// react/no-find-dom-node
//   Don't use findDOMNode
// ---------------------------------------------------------------------------
class FindDom extends React.Component {
  componentDidMount() {
    React.findDOMNode(this);
  }

  render() {
    return <div>find</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-did-update-set-state
//   Don't setState in componentDidUpdate
// ---------------------------------------------------------------------------
class DidUpdate extends React.Component {
  state = { x: 0 };

  componentDidUpdate() {
    this.setState({ x: 1 });
  }

  render() {
    return <div>{this.state.x}</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-unused-prop-types
//   Declared prop types not used
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/jsx-filename-extension
//   JSX only allowed in .jsx/.tsx files
//   (would need a .ts file to demonstrate - can't show in .tsx)
// ---------------------------------------------------------------------------

export {
  DeprecatedAPI,
  ThisInSfc,
  TypoClass,
  WillUpdateSetState,
  NoRenderReturn,
  StaticOutside,
  My_Bad_Component,
  PascalDemo,
  StringStyle,
  CustomComp,
  JsxBind,
  FindDom,
  DidUpdate,
};
