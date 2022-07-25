import type { StoreDefinition } from "pinia";
import type { DeepReadonly } from "vue";

export type ReadonlyStoreDefinition<
  T extends StoreDefinition,
  K extends keyof ReturnType<T> = keyof ReturnType<T>
> = T extends StoreDefinition<string, infer S, infer G, infer A>
  ? () => Pick<DeepReadonly<S> & G & A, K>
  : never;
