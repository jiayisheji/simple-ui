export interface JsonDictionary {
  [key: string]: string | boolean | number | null | undefined | JsonDictionary | JsonDictionary[];
}

export interface Dictionary<T> {
  [index: string]: T;
}

export interface NumericDictionary<T> {
  [index: number]: T;
}

export type AnyKindOfDictionary = Dictionary<{} | null | undefined> | NumericDictionary<{} | null | undefined>;
