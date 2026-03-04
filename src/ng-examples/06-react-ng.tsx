/* ==========================================================================
 * react/* and react-hooks/* rules NG examples
 * Source: plugin:react/recommended + airbnb + airbnb/hooks
 * ========================================================================== */
import React, { createContext, useEffect, useMemo, useState } from 'react';

// ---------------------------------------------------------------------------
// react/function-component-definition
//   Named components must be arrow functions
// ---------------------------------------------------------------------------
function FunctionComp() {
  return <div>should be arrow</div>;
}

// ---------------------------------------------------------------------------
// react/button-has-type
//   button must have explicit type attribute
// ---------------------------------------------------------------------------
const NoTypeBtn = () => <button>click</button>;

// ---------------------------------------------------------------------------
// react/self-closing-comp
//   Components without children must self-close
// ---------------------------------------------------------------------------
const NotSelfClose = () => <div></div>;

// ---------------------------------------------------------------------------
// react/destructuring-assignment
//   Props must be destructured
// ---------------------------------------------------------------------------
const NoDestructure = (props: { title: string }) => <h1>{props.title}</h1>;

// ---------------------------------------------------------------------------
// react/jsx-curly-brace-presence
//   Unnecessary curly braces around string literal
// ---------------------------------------------------------------------------
const UnnecessaryCurly = () => <div title={'hello'}>text</div>;

// ---------------------------------------------------------------------------
// react/jsx-no-useless-fragment
//   Fragment wrapping a single child
// ---------------------------------------------------------------------------
const UselessFrag = () => (
  <>
    <div>only child</div>
  </>
);

// ---------------------------------------------------------------------------
// react/jsx-fragments
//   Use <> shorthand instead of <React.Fragment>
// ---------------------------------------------------------------------------
const LongFragment = () => (
  <React.Fragment>
    <div>a</div>
    <div>b</div>
  </React.Fragment>
);

// ---------------------------------------------------------------------------
// react/jsx-boolean-value
//   Boolean props should omit ={true}
// ---------------------------------------------------------------------------
const BoolValue = () => <input disabled={true} />;

// ---------------------------------------------------------------------------
// react/jsx-no-bind
//   Don't use .bind() or inline arrow in JSX props (perf)
// ---------------------------------------------------------------------------
class BindInJsx extends React.Component {
  state = { count: 0 };

  handleClick() {
    this.setState({ count: 1 });
  }

  render() {
    return <button type="button" onClick={this.handleClick.bind(this)}>click</button>;
  }
}

// ---------------------------------------------------------------------------
// react/jsx-no-target-blank
//   target="_blank" without rel="noreferrer"
// ---------------------------------------------------------------------------
const UnsafeBlank = () => <a href="https://evil.com" target="_blank">link</a>;

// ---------------------------------------------------------------------------
// react/jsx-no-script-url
//   Don't use javascript: URLs in JSX
// ---------------------------------------------------------------------------
const ScriptUrl = () => <a href="javascript:void(0)">link</a>;

// ---------------------------------------------------------------------------
// react/jsx-no-constructed-context-values
//   Context value must be memoized
// ---------------------------------------------------------------------------
const MyCtx = createContext({ value: 0 });
const BadContextValue = () => (
  <MyCtx.Provider value={{ value: 1 }}>
    <div>children</div>
  </MyCtx.Provider>
);

// ---------------------------------------------------------------------------
// react/jsx-no-duplicate-props
//   Duplicate JSX props
// ---------------------------------------------------------------------------
const DuplicateProps = () => <div id="first" id="second" />;

// ---------------------------------------------------------------------------
// react/jsx-pascal-case
//   Component names must be PascalCase
// ---------------------------------------------------------------------------
const my_component = () => <div>bad name</div>;

// ---------------------------------------------------------------------------
// react/jsx-props-no-spreading
//   Don't spread props
// ---------------------------------------------------------------------------
const SpreadProps = (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />;

// ---------------------------------------------------------------------------
// react/jsx-no-comment-textnodes
//   Don't put JS comments as text inside JSX
// ---------------------------------------------------------------------------
const CommentText = () => <div>// this looks like a comment</div>;

// ---------------------------------------------------------------------------
// react/no-array-index-key
//   Don't use array index as key
// ---------------------------------------------------------------------------
const IndexKey = () => (
  <ul>
    {['a', 'b'].map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------------
// react/no-unstable-nested-components
//   Don't define components inside render
// ---------------------------------------------------------------------------
const NestedComp = () => {
  const Inner = () => <span>recreated</span>;
  return <Inner />;
};

// ---------------------------------------------------------------------------
// react/no-children-prop
//   Don't pass children as a prop
// ---------------------------------------------------------------------------
const ChildrenProp = () => <div children="bad" />;

// ---------------------------------------------------------------------------
// react/no-danger (warn)
//   dangerouslySetInnerHTML is dangerous
// ---------------------------------------------------------------------------
const DangerHtml = () => <div dangerouslySetInnerHTML={{ __html: '<b>bold</b>' }} />;

// ---------------------------------------------------------------------------
// react/no-danger-with-children
//   Don't use dangerouslySetInnerHTML with children
// ---------------------------------------------------------------------------
const DangerWithChildren = () => (
  <div dangerouslySetInnerHTML={{ __html: '<b>bold</b>' }}>child text</div>
);

// ---------------------------------------------------------------------------
// react/no-unescaped-entities
//   Escape special chars in JSX text
// ---------------------------------------------------------------------------
const UnescapedEntities = () => <div>don't use " or ' in JSX</div>;

// ---------------------------------------------------------------------------
// react/no-unknown-property
//   Unknown DOM property (e.g., class instead of className)
// ---------------------------------------------------------------------------
const UnknownProp = () => <div class="bad">text</div>;

// ---------------------------------------------------------------------------
// react/no-string-refs
//   Don't use string refs
// ---------------------------------------------------------------------------
class StringRef extends React.Component {
  render() {
    return <div ref="myRef">text</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-deprecated
//   Don't use deprecated React APIs
// ---------------------------------------------------------------------------
// (e.g. componentWillMount, componentWillReceiveProps)

// ---------------------------------------------------------------------------
// react/no-find-dom-node
//   Don't use findDOMNode
// ---------------------------------------------------------------------------
class FindDomNode extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line -- the rule we're testing
    const node = React.findDOMNode(this);
  }

  render() {
    return <div>find dom</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-is-mounted
//   Don't use isMounted
// ---------------------------------------------------------------------------
class IsMountedUsage extends React.Component {
  checkMounted() {
    return this.isMounted();
  }

  render() {
    return <div>mounted check</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-render-return-value
//   Don't use return value of ReactDOM.render
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-this-in-sfc
//   Don't use `this` in stateless functional component
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-did-update-set-state
//   Don't call setState in componentDidUpdate
// ---------------------------------------------------------------------------
class DidUpdateSetState extends React.Component {
  state = { count: 0 };

  componentDidUpdate() {
    this.setState({ count: 1 });
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-will-update-set-state
//   Don't call setState in componentWillUpdate
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-access-state-in-setstate
//   Don't access this.state inside setState
// ---------------------------------------------------------------------------
class AccessStateInSetState extends React.Component {
  state = { count: 0 };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <button type="button" onClick={() => this.increment()}>{this.state.count}</button>;
  }
}

// ---------------------------------------------------------------------------
// react/no-redundant-should-component-update
//   PureComponent should not have shouldComponentUpdate
// ---------------------------------------------------------------------------
class RedundantSCU extends React.PureComponent {
  shouldComponentUpdate() {
    return true;
  }

  render() {
    return <div>redundant</div>;
  }
}

// ---------------------------------------------------------------------------
// react/state-in-constructor
//   State should be initialized in constructor
// ---------------------------------------------------------------------------
class StateNotInConstructor extends React.Component {
  state = { value: 0 };

  render() {
    return <div>{this.state.value}</div>;
  }
}

// ---------------------------------------------------------------------------
// react/prefer-es6-class
//   Use ES6 class instead of createReactClass
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/prefer-stateless-function
//   Use SFC when class doesn't use state/lifecycle
// ---------------------------------------------------------------------------
class StatelessClass extends React.Component {
  render() {
    return <div>should be a function</div>;
  }
}

// ---------------------------------------------------------------------------
// react/sort-comp
//   Class component methods should follow specified order
// ---------------------------------------------------------------------------
class WrongOrder extends React.Component {
  render() {
    return <div>{this.state.val}</div>;
  }

  state = { val: 'out of order' };

  componentDidMount() {
    console.log('mounted');
  }
}

// ---------------------------------------------------------------------------
// react/static-property-placement
//   Static properties should be declared as static class properties
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/style-prop-object
//   style prop must be an object
// ---------------------------------------------------------------------------
const BadStyle = () => <div style={'color: red' as unknown as React.CSSProperties}>text</div>;

// ---------------------------------------------------------------------------
// react/void-dom-elements-no-children
//   Void elements (img, br, hr, input) must not have children
// ---------------------------------------------------------------------------
const VoidChildren = () => <img>child text</img>;

// ---------------------------------------------------------------------------
// react/no-unused-class-component-methods
//   Class method defined but never used in render
// ---------------------------------------------------------------------------
class UnusedMethod extends React.Component {
  unusedHelper() {
    return 'never called in render';
  }

  render() {
    return <div>unused method</div>;
  }
}

// ---------------------------------------------------------------------------
// react/no-invalid-html-attribute
//   Invalid HTML attribute value
// ---------------------------------------------------------------------------
const InvalidRel = () => <a href="/" rel="invalid-value">link</a>;

// ---------------------------------------------------------------------------
// react/prop-types
//   Missing prop types validation
//   (NOTE: often disabled in TypeScript projects, but still active here)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-namespace
//   Don't use namespace in component names
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-arrow-function-lifecycle
//   Lifecycle methods should not be arrow functions
// ---------------------------------------------------------------------------
class ArrowLifecycle extends React.Component {
  componentDidMount = () => {
    console.log('mounted');
  };

  render() {
    return <div>arrow lifecycle</div>;
  }
}

// ---------------------------------------------------------------------------
// react-hooks/rules-of-hooks
//   Hooks must not be called conditionally
// ---------------------------------------------------------------------------
const ConditionalHook = ({ on }: { on: boolean }) => {
  if (on) {
    useState(0);
  }
  return <div>bad hook</div>;
};

// ---------------------------------------------------------------------------
// react-hooks/exhaustive-deps
//   Missing dependency in useEffect
// ---------------------------------------------------------------------------
const MissingDep = ({ value }: { value: number }) => {
  useEffect(() => {
    console.log(value);
  }, []);
  return <div>{value}</div>;
};

// ---------------------------------------------------------------------------
// react/no-unused-prop-types
//   Declared prop type not used
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// react/no-unused-state
//   State field never used in render
// ---------------------------------------------------------------------------
class UnusedState extends React.Component {
  state = { used: 1, unused: 2 };

  render() {
    return <div>{this.state.used}</div>;
  }
}

export {
  FunctionComp,
  NoTypeBtn,
  NotSelfClose,
  NoDestructure,
  UnnecessaryCurly,
  UselessFrag,
  LongFragment,
  BoolValue,
  BindInJsx,
  UnsafeBlank,
  ScriptUrl,
  BadContextValue,
  DuplicateProps,
  my_component,
  SpreadProps,
  CommentText,
  IndexKey,
  NestedComp,
  ChildrenProp,
  DangerHtml,
  DangerWithChildren,
  UnescapedEntities,
  UnknownProp,
  StringRef,
  FindDomNode,
  IsMountedUsage,
  DidUpdateSetState,
  AccessStateInSetState,
  RedundantSCU,
  StateNotInConstructor,
  StatelessClass,
  WrongOrder,
  BadStyle,
  VoidChildren,
  UnusedMethod,
  InvalidRel,
  ArrowLifecycle,
  ConditionalHook,
  MissingDep,
  UnusedState,
};
