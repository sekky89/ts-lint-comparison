/* ==========================================================================
 * import/no-self-import NG example
 * ========================================================================== */
export const selfImportDemo = 1;
import { selfImportDemo as fromSelf } from './13-self-import-ng';

export const useFromSelf = () => fromSelf;
