/**
 * This is a generic way to enrich data with other data. Look at `@/features/klant/persoon-enricher.ts` for an example
 * We need this because of limitations in the library we use for caching, SWRV.
 * This library does not allow dynamic parallel queries, for example based on a list of records.
 * There is another popular library, `vue-query`, that does support this use case.
 * It's probably a good idea to make the switch at some point, because we could get rid of a lot of custom code.
 * *
 */
import { computed, type Ref } from "vue";
import {
  type ServiceData,
  type NotUndefined,
  ServiceResult,
} from "./service-data";

type ReadonlyRef<T extends readonly unknown[]> = {
  [I in keyof T]: Readonly<Ref<T[I]>>;
};

type GetParameters<K, I> = (i: NonNullable<I>) => NonNullable<K> | undefined;

type GetServiceData<K, O> = (
  keyFactory: () => NonNullable<K> | undefined
) => ServiceData<NotUndefined<O>>;

type GetInput<I> = () => NonNullable<I> | undefined;

type Result<K, O> = ReadonlyRef<
  readonly [NonNullable<K> | undefined, ServiceData<NotUndefined<O>>]
>;

export type Enricher<Input, Parameters, Output> = (
  getInput: GetInput<Input>
) => Result<Parameters, Output>;

export type TwoWayEnricher<I, K, O> = (
  getInput: GetInput<I | O>
) => ReadonlyRef<
  readonly [
    NonNullable<K> | undefined,
    ServiceData<NotUndefined<O>>,
    ServiceData<NotUndefined<I>>
  ]
>;

/**
 * Define a way to enrich data of a certain type. Start by specifying the type of data you want to enrich.
 * * Look at `@/features/klant/persoon-enricher.ts` for an example
 */
export function enrich<I>() {
  return {
    /**
     * Now define how to get the parameters by which we will search for data to enrich the type you specified before.
     * @param getParameters given the type you specified before, how can we get the parameters we will use to search for enrichment data?
     */
    by<P>(getParameters: GetParameters<P, I>) {
      return {
        /**
         * Now supply us with a way to search for enrichment data, using the key you specified in the precious step.
         * @param getServiceData Given a factory to resolve the parameters from the previous step, how do we get ServiceData containing the data you want to use to enrich?
         */
        with<O>(getServiceData: GetServiceData<P, O>): Enricher<I, P, O> {
          return (getInput) => {
            const inputRef = computed(getInput);

            const keyRef = computed(() => {
              const input = inputRef.value;
              if (input !== undefined) return getParameters(input);
              return undefined;
            });

            const serviceData = getServiceData(() => keyRef.value);

            const resultRef = computed(() => {
              const key = keyRef.value;
              const data =
                key === undefined ? ServiceResult.success(null) : serviceData;
              return data;
            });

            return [keyRef, resultRef];
          };
        },
      };
    },
  };
}

/**
 * Use this function to combine two enrichers that enrich data in the opposite direction, using the same parameters.
 * The result is an enricher that can work in both directions.
 * @param leftEnricher An enricher working in one direction
 * @param rightEnricher An enricher working in the opposite direction, using the same parameters
 * @param isLeft A way to know, given either of the two types of data, that we're dealing with the input for the first Enricher.
 */
export function combine<Input, Parameters, Output>(
  leftEnricher: Enricher<Input, Parameters, Output>,
  rightEnricher: Enricher<Output, Parameters, Input>,
  isLeft: (either: Input | Output) => either is Input
): TwoWayEnricher<Input, Parameters, Output> {
  return (getEither) => {
    const eitherRef = computed(getEither);

    const [leftKey, leftData] = leftEnricher(() => {
      const either = eitherRef.value;
      if (either === undefined || !isLeft(either)) return undefined;
      return either;
    });

    const [rightKey, rightData] = rightEnricher(() => {
      const either = eitherRef.value;
      if (either === undefined || isLeft(either)) return undefined;
      return either;
    });

    const newKey = computed(() => leftKey.value ?? rightKey.value);

    const iData = computed(() => {
      const either = eitherRef.value;
      if (either !== undefined && isLeft(either))
        return ServiceResult.success(either);
      return rightData.value;
    });

    const oData = computed(() => {
      const either = eitherRef.value;
      if (either !== undefined && !isLeft(either))
        return ServiceResult.success(either);
      return leftData.value;
    });

    return [newKey, oData, iData];
  };
}
