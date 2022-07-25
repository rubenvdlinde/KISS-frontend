import type { StoreDefinition } from "pinia";
import type { DeepReadonly } from "vue";

type ReadonlyStoreDefinition<T extends StoreDefinition> =
  T extends StoreDefinition<string, infer S, infer G, infer A>
    ? () => DeepReadonly<S> & G & A
    : never;

export function asReadOnly<T extends StoreDefinition>(
  storeDefinition: T
): ReadonlyStoreDefinition<T> {
  return storeDefinition as unknown as ReadonlyStoreDefinition<T>;
}
