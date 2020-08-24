import { SafeAny } from './any';

/** angular form OnTouched */
export type OnTouchedType = () => SafeAny;
/** angular form OnChange */
export type OnChangeType = (value: SafeAny) => void;
/**  angular form ValidatorOnChange */
export type ValidatorOnChange = () => void;
