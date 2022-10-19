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
            const keyRef = computed(() => {
              const input = getInput();
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
  first: Enricher<I, K, O>,
  other: Enricher<O, K, I>,
  isFirst: (either: I | O) => either is I
): TwoWayEnricher<I, K, O> {
  return (getInput) => {
    const inputRef = computed(getInput);

    const [firstKey, firstData] = first(() => {
      if (inputRef.value === undefined || !isFirst(inputRef.value))
        return undefined;
      return inputRef.value;
    });

    const [secondKey, secondData] = other(() => {
      if (inputRef.value === undefined || isFirst(inputRef.value))
        return undefined;
      return inputRef.value;
    });

    const newKey = computed(() => firstKey.value ?? secondKey.value);

    const iData = computed(() => {
      const io = inputRef.value;
      if (io !== undefined && isFirst(io)) return ServiceResult.success(io);
      return secondData.value;
    });

    const oData = computed(() => {
      const io = inputRef.value;
      if (o !== undefined && !isFirst(io)) return ServiceResult.success(io);
      return firstData.value;
    });

    return [newKey, oData, iData] as any;
  };
}
