/* import/named: "b" is not exported from mod-named */
import { a, b } from './mod-named';

export const sum = () => a + (b as number);
