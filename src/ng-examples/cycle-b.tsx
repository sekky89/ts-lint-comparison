/* import/no-cycle: B imports A */
import { valueA } from './cycle-a';

export const valueB = 2;
export const useA = () => valueA;
