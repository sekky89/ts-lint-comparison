/* ==========================================================================
 * jsx-a11y/* rules NG examples
 * Source: airbnb (eslint-plugin-jsx-a11y)
 * ========================================================================== */

// ---------------------------------------------------------------------------
// jsx-a11y/alt-text
//   img must have alt attribute
// ---------------------------------------------------------------------------
const NoAlt = () => <img src="/logo.png" />;

// ---------------------------------------------------------------------------
// jsx-a11y/anchor-has-content
//   Anchor must have content
// ---------------------------------------------------------------------------
const EmptyAnchor = () => <a href="/home" />;

// ---------------------------------------------------------------------------
// jsx-a11y/anchor-is-valid
//   Anchor used as button without valid href
// ---------------------------------------------------------------------------
const AnchorAsButton = () => <a onClick={() => {}}>click me</a>;

// ---------------------------------------------------------------------------
// jsx-a11y/aria-activedescendant-has-tabindex
//   Element with aria-activedescendant must have tabIndex
// ---------------------------------------------------------------------------
const NoTabIndex = () => <div aria-activedescendant="item-1">list</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/aria-props
//   Invalid ARIA attribute name
// ---------------------------------------------------------------------------
const BadAriaProp = () => <div aria-invalid-attr="true">text</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/aria-proptypes
//   Invalid ARIA attribute value
// ---------------------------------------------------------------------------
const BadAriaValue = () => <div aria-hidden="yes">text</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/aria-role
//   Invalid ARIA role
// ---------------------------------------------------------------------------
const BadRole = () => <div role="not-a-real-role">text</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/aria-unsupported-elements
//   ARIA attributes on elements that don't support them
// ---------------------------------------------------------------------------
const AriaOnMeta = () => <meta aria-hidden="true" />;

// ---------------------------------------------------------------------------
// jsx-a11y/click-events-have-key-events
//   Clickable element must have keyboard event handlers
// ---------------------------------------------------------------------------
const NoKeyEvent = () => <div onClick={() => {}}>clickable</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/control-has-associated-label
//   Interactive element must have accessible label
// ---------------------------------------------------------------------------
const NoLabel = () => <button type="button" />;

// ---------------------------------------------------------------------------
// jsx-a11y/heading-has-content
//   Heading must have content
// ---------------------------------------------------------------------------
const EmptyHeading = () => <h1 />;

// ---------------------------------------------------------------------------
// jsx-a11y/html-has-lang
//   <html> must have lang attribute
// ---------------------------------------------------------------------------
const NoLang = () => <html><body><div>content</div></body></html>;

// ---------------------------------------------------------------------------
// jsx-a11y/iframe-has-title
//   iframe must have title attribute
// ---------------------------------------------------------------------------
const NoIframeTitle = () => <iframe src="/page" />;

// ---------------------------------------------------------------------------
// jsx-a11y/img-redundant-alt
//   img alt should not contain "image", "picture", or "photo"
// ---------------------------------------------------------------------------
const RedundantAlt = () => <img src="/cat.jpg" alt="image of a cat" />;

// ---------------------------------------------------------------------------
// jsx-a11y/interactive-supports-focus
//   Interactive elements must be focusable
// ---------------------------------------------------------------------------
const NotFocusable = () => <div role="button" onClick={() => {}}>click</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/label-has-associated-control
//   label must be associated with a form control
// ---------------------------------------------------------------------------
const LoneLabel = () => <label>Name</label>;

// ---------------------------------------------------------------------------
// jsx-a11y/lang
//   lang attribute must have a valid value
// ---------------------------------------------------------------------------
const BadLang = () => <html lang="zz-ZZ"><body><div>content</div></body></html>;

// ---------------------------------------------------------------------------
// jsx-a11y/media-has-caption
//   video/audio must have captions
// ---------------------------------------------------------------------------
const NoCaptions = () => <video src="/video.mp4" />;

// ---------------------------------------------------------------------------
// jsx-a11y/mouse-events-have-key-events
//   onMouseOver/onMouseOut must have onFocus/onBlur
// ---------------------------------------------------------------------------
const MouseOnly = () => <div onMouseOver={() => {}}>hover me</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-access-key
//   Don't use accessKey attribute
// ---------------------------------------------------------------------------
const WithAccessKey = () => <button type="button" accessKey="n">next</button>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-autofocus
//   Don't use autoFocus attribute
// ---------------------------------------------------------------------------
const AutoFocused = () => <input autoFocus />;

// ---------------------------------------------------------------------------
// jsx-a11y/no-distracting-elements
//   Don't use <marquee> or <blink>
// ---------------------------------------------------------------------------
const Marquee = () => <marquee>scrolling text</marquee>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-interactive-element-to-noninteractive-role
//   Don't assign noninteractive role to interactive element
// ---------------------------------------------------------------------------
const InteractiveToNoninteractive = () => <button type="button" role="presentation">btn</button>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-noninteractive-element-interactions
//   Don't add interactions to noninteractive elements
// ---------------------------------------------------------------------------
const NoninteractiveClick = () => <li onClick={() => {}}>item</li>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-noninteractive-element-to-interactive-role
//   Don't assign interactive role to noninteractive element
// ---------------------------------------------------------------------------
const NoninteractiveToInteractive = () => <h1 role="button">heading as button</h1>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-noninteractive-tabindex
//   Don't add tabIndex to noninteractive elements
// ---------------------------------------------------------------------------
const NoninteractiveTab = () => <div tabIndex={0}>tabbable div</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-redundant-roles
//   Don't add redundant roles (e.g., role="button" on <button>)
// ---------------------------------------------------------------------------
const RedundantRole = () => <button type="button" role="button">btn</button>;

// ---------------------------------------------------------------------------
// jsx-a11y/no-static-element-interactions
//   Static elements should not have event handlers
// ---------------------------------------------------------------------------
const StaticClick = () => <div onClick={() => {}}>static element</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/role-has-required-aria-props
//   Elements with ARIA role must have required ARIA attributes
// ---------------------------------------------------------------------------
const MissingAriaProps = () => <div role="checkbox">check</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/role-supports-aria-props
//   ARIA props must be valid for the element's role
// ---------------------------------------------------------------------------
const BadRoleProp = () => <div role="alert" aria-checked="true">alert</div>;

// ---------------------------------------------------------------------------
// jsx-a11y/scope
//   scope attribute should only be used on <th>
// ---------------------------------------------------------------------------
const ScopeOnTd = () => (
  <table>
    <tbody>
      <tr><td scope="row">bad scope</td></tr>
    </tbody>
  </table>
);

// ---------------------------------------------------------------------------
// jsx-a11y/tabindex-no-positive
//   tabIndex should not be positive
// ---------------------------------------------------------------------------
const PositiveTabIndex = () => <div tabIndex={5}>high tabindex</div>;

export {
  NoAlt,
  EmptyAnchor,
  AnchorAsButton,
  NoTabIndex,
  BadAriaProp,
  BadAriaValue,
  BadRole,
  AriaOnMeta,
  NoKeyEvent,
  NoLabel,
  EmptyHeading,
  NoLang,
  NoIframeTitle,
  RedundantAlt,
  NotFocusable,
  LoneLabel,
  BadLang,
  NoCaptions,
  MouseOnly,
  WithAccessKey,
  AutoFocused,
  Marquee,
  InteractiveToNoninteractive,
  NoninteractiveClick,
  NoninteractiveToInteractive,
  NoninteractiveTab,
  RedundantRole,
  StaticClick,
  MissingAriaProps,
  BadRoleProp,
  ScopeOnTd,
  PositiveTabIndex,
};
