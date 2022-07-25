import type { StoreDefinition } from "pinia";
import type { DeepReadonly } from "vue";

export type ReadonlyStoreDefinition<T extends StoreDefinition> =
  T extends StoreDefinition<string, infer S, infer G, infer A>
    ? () => DeepReadonly<S> & G & A
    : never;
