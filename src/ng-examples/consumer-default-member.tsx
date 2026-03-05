/* import/no-named-as-default-member: access Def.foo (default's property, same name as named) */
import Def from './lib-default-member';

export const num = Def.foo;
