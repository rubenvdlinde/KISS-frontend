import { computed, type Ref } from "vue";
import {
  type ServiceData,
  type NotUndefined,
  ServiceResult,
} from "./service-data";

type ReadonlyRef<T extends readonly unknown[]> = {
  [I in keyof T]: Readonly<Ref<T[I]>>;
};

type GetKey<K, I> = (i: NonNullable<I>) => NonNullable<K> | undefined;

type GetServiceData<K, O> = (
  keyFunc: () => NonNullable<K> | undefined
) => ServiceData<NotUndefined<O>>;

type GetInput<I> = () => NonNullable<I> | undefined;

type Result<K, O> = ReadonlyRef<
  readonly [NonNullable<K> | undefined, ServiceData<NotUndefined<O>>]
>;

export type Enricher<I, K, O> = (getInput: GetInput<I>) => Result<K, O>;

export type TwoWayEnricher<I, K, O> = (
  getInput: GetInput<I | O>
) => ReadonlyRef<
  readonly [
    NonNullable<K> | undefined,
    ServiceData<NotUndefined<O>>,
    ServiceData<NotUndefined<I>>
  ]
>;

export function enrich<I>() {
  return {
    by<K>(getKey: GetKey<K, I>) {
      return {
        with<O>(getServiceData: GetServiceData<K, O>): Enricher<I, K, O> {
          return (getInput) => {
            const inputRef = computed(getInput);

            const keyRef = computed(() => {
              const input = inputRef.value;
              if (input !== undefined) return getKey(input);
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

export function combine<I, K, O>(
  leftEnricher: Enricher<I, K, O>,
  rightEnricher: Enricher<O, K, I>,
  isLeft: (either: I | O) => either is I
): TwoWayEnricher<I, K, O> {
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
