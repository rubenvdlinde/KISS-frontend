import {
  inject,
  provide,
  ref,
  type InjectionKey,
  type Ref,
  type UnwrapRef,
} from "vue";

const injectionKey = Symbol() as InjectionKey<StoreImplementation>;
const storeMap = new Map<string, Store<unknown>>();

export type CreateStoreParams<T> = {
  storeId: string;
  stateFactory: () => T;
  onExistingState?: (state: UnwrapRef<T>) => void | Promise<void>;
  onNewState?: (state: UnwrapRef<T>) => void | Promise<void>;
};

export type Store<T> = Ref<UnwrapRef<T>>;

export type StoreImplementation = <T>(params: CreateStoreParams<T>) => Store<T>;

function defaultStoreImplementation<T>({
  storeId,
  stateFactory,
  onExistingState,
  onNewState,
}: CreateStoreParams<T>): Store<T> {
  let store = storeMap.get(storeId) as Store<T> | undefined;

  if (!store) {
    store = ref(stateFactory());
    storeMap.set(storeId, store);
    onNewState?.(store.value);
  } else {
    onExistingState?.(store.value);
  }

  return store;
}

export function provideStoreImplementation(
  implementation: StoreImplementation
) {
  provide(injectionKey, implementation);
}

export function getStore<T>(params: CreateStoreParams<T>): Store<T> {
  //causes a warning if not injected..todo: find out how to properly check if something has been provided
  const implementation = inject(injectionKey) ?? defaultStoreImplementation;
  return implementation(params) as Store<T>;
}
