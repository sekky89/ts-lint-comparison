/* import/no-named-as-default-member: default has .foo, and named export foo exists */
const obj = { foo: 1 };
export default obj;
export const foo = 2;
