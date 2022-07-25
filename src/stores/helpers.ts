import type { StoreDefinition } from "pinia";
import type { DeepReadonly } from "vue";

/**
 * Cast a store definition as readonly, so the only way to modify state is by using actions
 * @param storeDefinition
 */
export function asReadOnly<S, G, A>(
  storeDefinition: StoreDefinition<string, S, G, A>
) {
  return storeDefinition as () => DeepReadonly<S> & G & A;
}
