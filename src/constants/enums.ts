type EnumMetaMap = Record<string, Record<PropertyKey, unknown>>;

type DefinedEnum<M extends EnumMetaMap> = {
  Values: readonly (keyof M)[];
  pickMap<P extends keyof M[keyof M]>(prop: P): { [K in keyof M]: M[K][P] };
  get<K extends keyof M>(key: K): M[K];
};

type EnumInferMeta<E> = E extends DefinedEnum<infer M> ? M : never;

type EnumValue<E extends { Values: readonly PropertyKey[] }> = E["Values"][number];

function defineEnum<const M extends EnumMetaMap>(metaMap: M): DefinedEnum<M> {
  type Key = keyof M;
  const Values = Object.keys(metaMap) as Key[];
  function pickMap<P extends keyof M[Key]>(prop: P) {
    return Object.fromEntries(Object.entries(metaMap).map(([k, v]) => [k, v[prop]])) as {
      [K in Key]: M[K][P];
    };
  }
  function get<K extends Key>(key: K): M[K] {
    return metaMap[key];
  }
  return { Values, pickMap, get };
}

function enumPickMap<M extends EnumMetaMap, P extends keyof M[keyof M]>(e: DefinedEnum<M>, prop: P): { [K in keyof M]: M[K][P] } {
  return e.pickMap(prop) as { [K in keyof M]: M[K][P] };
}

export { defineEnum, enumPickMap };
export type { EnumMetaMap, DefinedEnum, EnumInferMeta, EnumValue };
