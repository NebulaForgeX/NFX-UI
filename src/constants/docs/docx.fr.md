# Documentation du module Constants

Guide d’utilisation des constantes partagées et des usines de clés React Query.

---

## Point d’entrée

Toutes les API publiques sont ré-exportées depuis `@/constants` ou `@/constants/index`.

```ts
import { CACHE_ITEM, CACHE_LIST, createItemKey, createKey, createListKey, createQueryKeys, defineEnum, enumPickMap } from "@/constants";
```

---

## 1. Caches

Segments fixes utilisés dans les clés de requête pour distinguer « liste » et « élément ».

| Nom          | Type     | Valeur   | Description                     |
| ------------ | -------- | -------- | ------------------------------- |
| `CACHE_LIST` | `string` | `"list"` | Segment de clé pour les listes. |
| `CACHE_ITEM` | `string` | `"item"` | Segment de clé pour un élément. |

**Exemple**

```ts
import { CACHE_ITEM, CACHE_LIST } from "@/constants";

// Souvent utilisé en interne par createListKey / createItemKey ; aussi pour des clés personnalisées
const customKey = ["catalog", CACHE_LIST, "category"];
// => ["catalog", "list", "category"]
```

---

## 2. createKey

Crée une clé de requête à partir de segments arbitraires (ex. stats, dimensions personnalisées).

**Signature**

```ts
function createKey(...segments: unknown[]): QueryKey;
```

**Entrée**

| Paramètre     | Type        | Description                                    |
| ------------- | ----------- | ---------------------------------------------- |
| `...segments` | `unknown[]` | Segments arbitraires (chaînes, nombres, etc.). |

**Sortie**

- `QueryKey` : tableau des `segments` dans l’ordre.

**Exemple**

```ts
import { createKey } from "@/constants";

const key = createKey("catalog", "stats", "category", "count");
// => ["catalog", "stats", "category", "count"]

useQuery({
  queryKey: createKey("auth", "me"),
  queryFn: fetchCurrentUser,
});
```

---

## 3. createListKey

Crée une clé de requête pour une liste, avec `.withPrefix()` chaînable.

**Signature**

```ts
function createListKey(domain: string, subDomain: string): ListKeyChainable;
```

**Entrée**

| Paramètre   | Type     | Description                                   |
| ----------- | -------- | --------------------------------------------- |
| `domain`    | `string` | Nom de domaine (ex. `"catalog"`, `"auth"`).   |
| `subDomain` | `string` | Sous-domaine (ex. `"category"`, `"product"`). |

**Sortie**

- `ListKeyChainable` : un `QueryKey` (tableau) avec `.withPrefix(...prefix)` qui renvoie un nouveau `ListKeyChainable`.
- Forme par défaut de la clé : `[domain, CACHE_LIST, subDomain]` soit `[domain, "list", subDomain]`.

**Exemple**

```ts
import { createListKey } from "@/constants";

const listKey = createListKey("catalog", "category");
// listKey => ["catalog", "list", "category"]

useQuery({ queryKey: listKey, queryFn: fetchCategories });

// Chaîner les préfixes (le dernier withPrefix est en tête du tableau)
const versioned = createListKey("catalog", "category").withPrefix("api").withPrefix("v1");
// versioned => ["v1", "api", "catalog", "list", "category"]
```

---

## 4. createItemKey

Crée une usine de clé pour un élément (un ou plusieurs id), avec `.withPrefix()` chaînable.

**Signature**

```ts
function createItemKey(domain: string, subDomain: string): ItemKeyChainable;
```

**Entrée**

| Paramètre   | Type     | Description     |
| ----------- | -------- | --------------- |
| `domain`    | `string` | Nom de domaine. |
| `subDomain` | `string` | Sous-domaine.   |

**Sortie**

- `ItemKeyChainable` : appelable `(...ids: string[]) => QueryKey` avec `.withPrefix(...prefix)` qui renvoie un nouveau `ItemKeyChainable`.
- Forme de la clé à l’appel : `[domain, CACHE_ITEM, subDomain, ...ids]` soit `[domain, "item", subDomain, ...ids]`.

**Exemple**

```ts
import { createItemKey } from "@/constants";

const itemKey = createItemKey("catalog", "category");
itemKey("abc");
// => ["catalog", "item", "category", "abc"]

itemKey("cat-1", "sub-2");
// => ["catalog", "item", "category", "cat-1", "sub-2"]

useQuery({ queryKey: itemKey(id), queryFn: () => fetchCategory(id) });

// Avec préfixe
const versionedItem = createItemKey("catalog", "category").withPrefix("api")("abc");
// => ["api", "catalog", "item", "category", "abc"]
```

---

## 5. createQueryKeys

Renvoie un bundle contenant la clé de liste et l’usine de clé d’élément pour le même domain/subDomain, avec `.withPrefix()` chaînable sur le bundle.

**Signature**

```ts
function createQueryKeys(domain: string, subDomain: string): QueryKeysBundle;
```

**Entrée**

| Paramètre   | Type     | Description     |
| ----------- | -------- | --------------- |
| `domain`    | `string` | Nom de domaine. |
| `subDomain` | `string` | Sous-domaine.   |

**Sortie**

- `QueryKeysBundle` :
  - `list` : `ListKeyChainable` (identique à `createListKey`)
  - `item` : `ItemKeyChainable` (identique à `createItemKey`)
  - `withPrefix(...prefix)` : renvoie un nouveau `QueryKeysBundle` dont `list` et `item` ont le même préfixe.

**Exemple**

```ts
import { createQueryKeys } from "@/constants";

const { list, item } = createQueryKeys("catalog", "category");
// list => ["catalog", "list", "category"]
// item("id-1") => ["catalog", "item", "category", "id-1"]

useQuery({ queryKey: list, queryFn: fetchCategories });
useQuery({ queryKey: item(id), queryFn: () => fetchCategory(id) });

// Bundle avec préfixe
const withApi = createQueryKeys("catalog", "category").withPrefix("api");
// withApi.list => ["api", "catalog", "list", "category"]
// withApi.item("id-1") => ["api", "catalog", "item", "category", "id-1"]
```

---

## 6. defineEnum

Définit un enum typé à partir d’une map de métadonnées, avec `Values`, `pickMap` et `get`.

**Signature**

```ts
function defineEnum<const M extends EnumMetaMap>(metaMap: M): DefinedEnum<M>;
```

**Entrée**

| Paramètre | Type                                           | Description                                         |
| --------- | ---------------------------------------------- | --------------------------------------------------- |
| `metaMap` | `Record<string, Record<PropertyKey, unknown>>` | Map des clés d’enum vers les objets de métadonnées. |

**Sortie**

- `DefinedEnum<M>` :
  - `Values` : tableau des clés d’enum, ex. `["A", "B"]`.
  - `pickMap(prop)` : extrait une propriété de chaque entrée : `{ [K]: metaMap[K][prop] }`.
  - `get(key)` : renvoie les métadonnées de la clé : `metaMap[key]`.

**Exemple**

```ts
import { defineEnum } from "@/constants";

const Status = defineEnum({
  Draft: { label: "Brouillon", value: 0 },
  Published: { label: "Publié", value: 1 },
});

Status.Values;
// => ["Draft", "Published"]

Status.get("Draft");
// => { label: "Brouillon", value: 0 }

Status.pickMap("label");
// => { Draft: "Brouillon", Published: "Publié" }

Status.pickMap("value");
// => { Draft: 0, Published: 1 }
```

---

## 7. enumPickMap

Extrait une map d’une propriété pour chaque entrée d’enum (équivalent à `e.pickMap(prop)`).

**Signature**

```ts
function enumPickMap<M extends EnumMetaMap, P extends keyof M[keyof M]>(e: DefinedEnum<M>, prop: P): { [K in keyof M]: M[K][P] };
```

**Entrée**

| Paramètre | Type             | Description                                    |
| --------- | ---------------- | ---------------------------------------------- |
| `e`       | `DefinedEnum<M>` | Valeur renvoyée par `defineEnum`.              |
| `prop`    | `P`              | Nom de la propriété de métadonnées à extraire. |

**Sortie**

- `{ [K in keyof M]: M[K][P] }` : objet qui associe chaque clé d’enum `K` à `metaMap[K][prop]`.

**Exemple**

```ts
import { defineEnum, enumPickMap } from "@/constants";

const Status = defineEnum({
  Draft: { label: "Brouillon", value: 0 },
  Published: { label: "Publié", value: 1 },
});

enumPickMap(Status, "label");
// => { Draft: "Brouillon", Published: "Publié" }
```

---

## Référence des types

| Type                                              | Description                                                                                       |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `QueryKey`                                        | Type de clé React Query (souvent un tableau).                                                     |
| `ListKeyChainable`                                | Clé liste : `QueryKey` + `.withPrefix(...) => ListKeyChainable`.                                  |
| `ItemKeyChainable`                                | Usine de clé élément : `(...ids: string[]) => QueryKey` + `.withPrefix(...) => ItemKeyChainable`. |
| `QueryKeysBundle`                                 | `{ list, item, withPrefix(...) }` ; list/item comme ci-dessus.                                    |
| `EnumMetaMap` / `DefinedEnum<M>` / `EnumValue<E>` | Voir `enums.ts` et la section `defineEnum` ci-dessus.                                             |

---

## Ordre des préfixes

Pour les appels chaînés à `.withPrefix()` sur `createListKey`, `createItemKey` ou `createQueryKeys().withPrefix` :

- **Le dernier `.withPrefix(...)` apparaît en tête du tableau de la clé.**
- Exemple : `.withPrefix("api").withPrefix("v1")` → la clé commence par `["v1", "api", ...]`.
