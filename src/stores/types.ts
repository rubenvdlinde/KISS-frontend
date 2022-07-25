import type { StoreDefinition } from "pinia";
import type { DeepReadonly } from "vue";

export type ReadonlyStoreDefinition<
  T extends StoreDefinition,
  K extends keyof ReturnType<T> | never = never
> = T extends StoreDefinition<string, infer S, infer G, infer A>
  ? K extends never
    ? () => DeepReadonly<S> & G & A
    : () => Omit<DeepReadonly<S> & G & A, K>
  : never;
