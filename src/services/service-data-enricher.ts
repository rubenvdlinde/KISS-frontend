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

function combine<I, K, O>(
  first: Enricher<I, K, O>,
  other: Enricher<O, K, I>
): Combined<I, K, O> {
  return {
    build(getInput) {
      const getOserviceData = first.build(() => getInput()?.[0]);
      const getIserviceData = other.build(() => getInput()?.[1]);

      return () => {
        const [i, o] = getInput() ?? [];

        if (i !== undefined) {
          const [key, serviceDataO] = getOserviceData();
          return [key, serviceDataO, ServiceResult.success(i)];
        }

        const [key, serviceDataI] = getIserviceData();

        if (o !== undefined)
          return [key, ServiceResult.success(o), serviceDataI];

        throw new Error();
      };
    },
  };
}

type Combined<I, K, O> = {
  build: (
    getInput: GetInput<Either<I, O>>
  ) => () => readonly [
    NonNullable<K> | undefined,
    ServiceData<NotUndefined<O>>,
    ServiceData<NotUndefined<I>>
  ];
};

export type Either<A, B> = Readonly<
  [NonNullable<A>, undefined] | [undefined, NonNullable<B>]
>;

export type Enricher<I, K, O> = {
  build: Build<I, K, O>;
};

export type Combinable<I, K, O> = {
  combineWith: (other: Enricher<O, K, I>) => Combined<I, K, O>;
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
