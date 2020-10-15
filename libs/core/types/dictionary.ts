export interface JsonDictionary {
  [key: string]: string | boolean | number | null | undefined | JsonDictionary | JsonDictionary[];
}

export type PartialObject<T> = Partial<T>;

export type Many<T> = T | ReadonlyArray<T>;

export type PropertyPath = Many<PropertyKey>;

export type PartialDeep<T> = {
  [P in keyof T]?: PartialDeep<T[P]>;
};

export interface Dictionary<T> {
  [index: string]: T;
}

export interface NumericDictionary<T> {
  [index: number]: T;
}

export type AnyKindOfDictionary = Dictionary<{} | null | undefined> | NumericDictionary<{} | null | undefined>;
