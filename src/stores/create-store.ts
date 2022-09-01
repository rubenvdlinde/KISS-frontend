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
  onHydrate?: () => void | Promise<void>;
};

export type Store<T> = Ref<UnwrapRef<T>>;

export type StoreImplementation = <T>(params: CreateStoreParams<T>) => Store<T>;

function defaultStoreImplementation<T>({
  storeId,
  stateFactory,
}: CreateStoreParams<T>): Store<T> {
  let store = storeMap.get(storeId) as Store<T> | undefined;

  if (!store) {
    store = ref(stateFactory());
    storeMap.set(storeId, store);
  }

  return store;
}

export function provideStoreImplementation(
  implementation: StoreImplementation
) {
  provide(injectionKey, implementation);
}

export function getStore<T>(params: CreateStoreParams<T>): Store<T> {
  const implementation = inject(injectionKey) ?? defaultStoreImplementation;
  return implementation(params) as Store<T>;
}
