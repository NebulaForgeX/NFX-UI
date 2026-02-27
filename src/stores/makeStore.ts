/**
 * 通用 Store 工厂（学习 hooks 的 make 函数模式）。
 * Generic store factory (make pattern like hooks makeUnifiedQuery).
 */

import { createStore, useStore } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

/** SetState：与 zustand 的 set 一致。Same as zustand set. */
export type SetState<S> = (partial: Partial<S> | ((state: S) => Partial<S>)) => void;

/** GetState：与 zustand 的 get 一致。Same as zustand get. */
export type GetState<S> = () => S;

/**
 * 创建带 subscribeWithSelector 的 Store（不持久化）。
 * Create store with subscribeWithSelector (no persist).
 *
 * @param initialState - 初始状态。Initial state.
 * @param actions - (set, get) => actions 对象。(set, get) => actions object.
 * @returns { store, useStore } 供外部使用。Returns { store, useStore }.
 *
 * @example
 * ```ts
 * const { store, useStore } = makeStore(
 *   { count: 0 },
 *   (set) => ({ increment: () => set((s) => ({ count: s.count + 1 })) })
 * );
 * const count = useStore((s) => s.count);
 * ```
 */
export function makeStore<S extends object, A extends object>(initialState: S, actions: (set: SetState<S & A>, get: GetState<S & A>) => A) {
  const store = createStore<S & A>()(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      ...actions(set as SetState<S & A>, get as GetState<S & A>),
    })),
  );
  const useStoreBound = <T>(selector: (state: S & A) => T): T => useStore(store, selector);
  return { store, useStore: useStoreBound };
}

/** makePersistStore 的配置。Config for makePersistStore. */
export interface MakePersistStoreOptions<S extends object, A extends object> {
  /** 持久化 key（localStorage）。Persist key (localStorage). */
  name: string;
  /** 初始状态。Initial state. */
  initialState: S;
  /** (set, get) => actions。(set, get) => actions. */
  actions: (set: SetState<S & A>, get: GetState<S & A>) => A;
  /** 只持久化部分 state；缺省则全量。Partialize state to persist; default full. */
  partialize?: (state: S & A) => Partial<S & A>;
  /** 版本号（用于 migrate）。Version for migrate. */
  version?: number;
  /** 迁移旧持久化数据。Migrate persisted state. */
  migrate?: (persistedState: unknown, version: number) => Partial<S & A>;
}

/**
 * 创建带 persist + subscribeWithSelector 的 Store。
 * Create store with persist and subscribeWithSelector.
 *
 * @param options - name, initialState, actions, partialize?, version?, migrate?
 * @returns { store, useStore }
 *
 * @example
 * ```ts
 * const { store, useStore } = makePersistStore({
 *   name: "auth-storage",
 *   initialState: { token: null },
 *   actions: (set) => ({ setToken: (t) => set({ token: t }) }),
 * });
 * ```
 */
export function makePersistStore<S extends object, A extends object>(options: MakePersistStoreOptions<S, A>) {
  const { name, initialState, actions: actionsFn, partialize, version, migrate } = options;
  const store = createStore<S & A>()(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          ...initialState,
          ...actionsFn(set as SetState<S & A>, get as GetState<S & A>),
        }),
        {
          name,
          ...(partialize && { partialize }),
          ...(version !== undefined && { version }),
          ...(migrate && { migrate }),
        },
      ),
    ),
  );
  const useStoreBound = <T>(selector: (state: S & A) => T): T => useStore(store, selector);
  return { store, useStore: useStoreBound };
}
