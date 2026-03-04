/* ==========================================================================
 * Remaining react/* rules NG examples
 * Rules not yet detected in previous files
 * ========================================================================== */
import React from 'react';

// ---------------------------------------------------------------------------
// React/prop-types
//   Missing prop types (triggers with non-TS prop validation)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/jsx-no-undef
//   Using undefined JSX component
// ---------------------------------------------------------------------------
// Const UndefinedComp = () => <NonExistent />; // TS would catch this

// ---------------------------------------------------------------------------
// React/no-deprecated
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
// React/no-render-return-value
//   Don't use the return value of ReactDOM.render
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/no-this-in-sfc
//   Don't use `this` in stateless function component
// ---------------------------------------------------------------------------
const ThisInSfc = () => <div>{this}</div>

// ---------------------------------------------------------------------------
// React/no-typos
//   Typos in static class properties (e.g., defaultprops vs defaultProps)
// ---------------------------------------------------------------------------
class TypoClass extends React.Component {
  static defaultprops = { name: 'test' };

  render() {
    return <div>typo</div>;
  }
}

// ---------------------------------------------------------------------------
// React/no-will-update-set-state
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
// React/require-render-return
//   Render() must return something
// ---------------------------------------------------------------------------
class NoRenderReturn extends React.Component {
  render() {
    console.log('no return');
  }
}

// ---------------------------------------------------------------------------
// React/prefer-es6-class
//   Use ES6 class syntax
// ---------------------------------------------------------------------------
// (createReactClass is not importable in this project)

// ---------------------------------------------------------------------------
// React/prefer-exact-props
//   Use exact props
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/forbid-prop-types
//   Forbid vague prop types (any, array, object)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/static-property-placement
//   Static properties should be in the class body
// ---------------------------------------------------------------------------
class StaticOutside extends React.Component {
  render() {
    return <div>static</div>;
  }
}
StaticOutside.defaultProps = { name: 'default' };

// ---------------------------------------------------------------------------
// React/default-props-match-prop-types
//   DefaultProps must match declared prop types
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/forbid-foreign-prop-types (warn)
//   Don't access other components' propTypes
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/jsx-pascal-case
//   Component name used in JSX must be PascalCase
//   (lowercase JSX tags are treated as DOM elements, need uppercase start)
// ---------------------------------------------------------------------------
const My_Bad_Component = () => <div>bad name</div>;
const PascalDemo = () => <My_Bad_Component />;

// ---------------------------------------------------------------------------
// React/no-namespace
//   Don't use namespace in component names (e.g., <Foo:Bar>)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/jsx-uses-vars
//   Variables used in JSX are considered used
//   (This is a helper rule, not really an NG pattern)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/style-prop-object
//   Style prop must be an object, not a string
// ---------------------------------------------------------------------------
const StringStyle = () => <div style={'color: red' as unknown as undefined}>text</div>;

// ---------------------------------------------------------------------------
// React/jsx-no-bind
//   AllowArrowFunctions: true, ignoreDOMComponents: true
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
// React/no-find-dom-node
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
// React/no-did-update-set-state
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
// React/no-unused-prop-types
//   Declared prop types not used
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// React/jsx-filename-extension
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
