/* import/no-cycle: A imports B, B imports A */
import { valueB } from './cycle-b';

export const valueA = 1;
export const useB = () => valueB;
