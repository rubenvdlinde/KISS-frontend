import type { ServiceData, NotUndefined } from "./service-data";

type GetKey<K, I> = (i: NonNullable<I>) => NonNullable<K> | undefined;

type GetServiceData<K, O> = (
  keyFunc: () => NonNullable<K> | undefined
) => ServiceData<NotUndefined<O>>;

type GetInput<I> = () => NonNullable<I>;

type Result<K, O> = readonly [
  NonNullable<K> | undefined,
  ServiceData<NotUndefined<O>>
];

type Execute<K, O> = () => Result<K, O>;

type Build<I, K, O> = (getInput: GetInput<I>) => Execute<K, O>;

type CombinedResult<K, OA, OB> = readonly [...Result<K, OA>, Result<K, OB>[1]];

type CombinedExecute<K, OA, OB> = () => CombinedResult<K, OA, OB>;

type CombinedBuild<IA, IB, K, OA, OB> = (
  getInput: GetInput<Either<IA, IB>>
) => CombinedExecute<K, OA, OB>;

export type Either<A, B> = Readonly<
  [NonNullable<A>, undefined] | [undefined, NonNullable<B>]
>;

export type Enricher<I, K, O> = {
  getKey: GetKey<K, I>;
  getServiceData: GetServiceData<K, O>;
};

export type Combinable<I, K, O> = {
  combineWith: <IB, OB>(
    other: Enricher<IB, K, OB>
  ) => {
    build: CombinedBuild<I, IB, K, O, OB>;
  };
};

export type Buildable<I, K, O> = {
  build: Build<I, K, O>;
};

function combine<IA, IB, K, OA, OB>(
  first: Enricher<IA, K, OA>,
  other: Enricher<IB, K, OB>
): {
  build: CombinedBuild<IA, IB, K, OA, OB>;
} {
  const getKey: GetKey<K, Either<IA, IB>> = (either) => {
    const [i, ni] = either;
    if (i !== undefined) return first.getKey(i);
    if (ni !== undefined) return other.getKey(ni);
    return undefined;
  };

  return {
    build(getInput) {
      const keyResolver = () => getKey(getInput());
      const firstData = first.getServiceData(keyResolver);
      const secondData = other.getServiceData(keyResolver);
      return () => {
        const key = keyResolver();
        return [key, firstData, secondData] as const;
      };
    },
  };
}

export const Enrich = {
  from<I>() {
    return {
      by<K>(getKey: GetKey<K, I>) {
        return {
          using<O>(
            getServiceData: GetServiceData<K, O>
          ): Enricher<I, K, O> & Combinable<I, K, O> & Buildable<I, K, O> {
            return {
              getKey,
              getServiceData,
              combineWith(other) {
                return combine(this, other);
              },
              build(getInput) {
                const keyResolver = () => getKey(getInput());
                const data = getServiceData(keyResolver);
                return () => [keyResolver(), data];
              },
            };
          },
        };
      },
    };
  },
};
