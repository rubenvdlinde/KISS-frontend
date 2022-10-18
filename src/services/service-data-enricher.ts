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

type Left<T> = readonly [NonNullable<T>, undefined];
type Right<T> = readonly [undefined, NonNullable<T>];

export type Either<A, B> = Left<A> | Right<B>;

export type Enricher<I, K, O> = (getInput: GetInput<I>) => Result<K, O>;

export type TwoWayEnricher<I, K, O> = (
  getInput: GetInput<Either<I, O>>
) => ReadonlyRef<
  readonly [
    NonNullable<K> | undefined,
    ServiceData<NotUndefined<O>>,
    ServiceData<NotUndefined<I>>
  ]
>;

export function left<T>(t: NonNullable<T>): Left<T> {
  return [t, undefined];
}

export function right<T>(t: NonNullable<T>): Right<T> {
  return [undefined, t];
}

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
  other: Enricher<O, K, I>
): TwoWayEnricher<I, K, O> {
  return (getInput) => {
    const [firstKey, firstData] = first(() => getInput()?.[0]);
    const [secondKey, secondData] = other(() => getInput()?.[1]);

    const newKey = computed(() => firstKey.value ?? secondKey.value);
    const inputRef = computed(getInput);
    const iData = computed(() => {
      const [i] = inputRef.value ?? [];
      if (i !== undefined) return ServiceResult.success(i);
      return secondData.value;
    });
    const oData = computed(() => {
      const [_, o] = inputRef.value ?? [];
      if (o !== undefined) return ServiceResult.success(o);
      return firstData.value;
    });

    return [newKey, oData, iData];
  };
}
