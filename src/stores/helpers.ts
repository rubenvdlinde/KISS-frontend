import type { StoreDefinition, StateTree, _GettersTree } from "pinia";
import type { DeepReadonly } from "vue";

type ReadonlyStoreDefinition<
  S extends StateTree,
  G extends _GettersTree<S>,
  A
> = () => DeepReadonly<S> & G & A;

/**
 * Cast a store definition as readonly, so the only way to modify state is by using actions
 * @param storeDefinition
 */
export function asReadOnly<S extends StateTree, G extends _GettersTree<S>, A>(
  storeDefinition: StoreDefinition<string, S, G, A>
) {
  return storeDefinition as ReadonlyStoreDefinition<S, G, A>;
}
