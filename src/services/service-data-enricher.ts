import {
  type ServiceData,
  type NotUndefined,
  ServiceResult,
} from "./service-data";

type GetKey<K, I> = (i: NonNullable<I>) => NonNullable<K> | undefined;

type GetServiceData<K, O> = (
  keyFunc: () => NonNullable<K> | undefined
) => ServiceData<NotUndefined<O>>;

type GetInput<I> = () => NonNullable<I> | undefined;

type Result<K, O> = readonly [
  NonNullable<K> | undefined,
  ServiceData<NotUndefined<O>>
];

type Execute<K, O> = () => Result<K, O>;

type Build<I, K, O> = (getInput: GetInput<I>) => Execute<K, O>;

type CombinedResult<K, OA, OB> = readonly [
  NonNullable<K> | undefined,
  ServiceData<NotUndefined<OA>>,
  ServiceData<NotUndefined<OB>>
];

type CombinedExecute<K, OA, OB> = () => CombinedResult<K, OA, OB>;

type CombinedBuild<I, K, O> = (
  getInput: () => Either<I, O>
) => CombinedExecute<K, O, I>;

type BuildableCombined<I, K, O> = {
  build: CombinedBuild<I, K, O>;
};

function combine<I, K, O>(
  first: Enricher<I, K, O>,
  other: Enricher<O, K, I>
): BuildableCombined<I, K, O> {
  return {
    build(getInput) {
      const getOserviceData = first.build(() => getInput()[0]);
      const getIserviceData = other.build(() => getInput()[1]);

      return () => {
        const either = getInput();
        const [i, o] = either;

        if (i !== undefined) {
          const [key, serviceDataO] = getOserviceData();
          return [
            key,
            serviceDataO,
            ServiceResult.success(i),
          ] as CombinedResult<K, O, I>;
        }

        const [key, serviceDataI] = getIserviceData();

        if (o !== undefined)
          return [
            key,
            ServiceResult.success(o),
            serviceDataI,
          ] as CombinedResult<K, O, I>;

        throw new Error();
      };
    },
  };
}

export type Either<A, B> = Readonly<
  [NonNullable<A>, undefined] | [undefined, NonNullable<B>]
>;

export type Enricher<I, K, O> = {
  getKey: GetKey<K, I>;
  getServiceData: GetServiceData<K, O>;
  build: Build<I, K, O>;
};

export type Combinable<I, K, O> = {
  combineWith: (other: Enricher<O, K, I>) => BuildableCombined<I, K, O>;
};

export const Enrich = {
  from<I>() {
    return {
      by<K>(getKey: GetKey<K, I>) {
        return {
          using<O>(
            getServiceData: GetServiceData<K, O>
          ): Enricher<I, K, O> & Combinable<I, K, O> {
            return {
              getKey,
              getServiceData,
              combineWith(other) {
                return combine(this, other);
              },
              build(getInput) {
                const keyResolver = () => {
                  const input = getInput();
                  if (input !== undefined) return getKey(input);
                };
                const serviceData = getServiceData(keyResolver);
                return () => {
                  const key = keyResolver();
                  const data =
                    key === undefined
                      ? ServiceResult.success(null)
                      : serviceData;
                  return [key, data];
                };
              },
            };
          },
        };
      },
    };
  },
};
