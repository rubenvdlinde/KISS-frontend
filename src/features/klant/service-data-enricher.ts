import { ServiceResult, type NotUndefined, type ServiceData } from "@/services";

export type Either<A, B> = Readonly<[A, undefined] | [undefined, B]>;

type ReturnType<A, B, K> = readonly [
  K | undefined,
  ServiceData<NotUndefined<A>>,
  ServiceData<NotUndefined<B>>
];

export function useEnricher<A, B, K>(
  getRecord: () => Either<NonNullable<A>, NonNullable<B>>,
  getAKey: (a: NonNullable<A>) => NonNullable<K> | undefined,
  getBKey: (b: NonNullable<B>) => NonNullable<K> | undefined,
  getAData: (key: () => K | undefined) => ServiceData<NotUndefined<A>>,
  getBData: (key: () => K | undefined) => ServiceData<NotUndefined<B>>
): () => ReturnType<A, B, K> {
  const keyFromAorB = () => {
    const [a, b] = getRecord();
    if (a !== undefined) return getAKey(a);
    if (b !== undefined) return getBKey(b);
    return undefined;
  };
  const aData = getAData(keyFromAorB);
  const bData = getBData(keyFromAorB);

  const getA = (
    [a]: Either<A, B>,
    k: K | undefined
  ): ServiceData<NotUndefined<A>> => {
    if (a) return ServiceResult.success(a);
    if (!k) return ServiceResult.success(null);
    return aData;
  };

  const getB = (
    either: Either<A, B>,
    k: K | undefined
  ): ServiceData<NotUndefined<B>> => {
    const b = either[1];
    if (b) return ServiceResult.success(b);
    if (!k) return ServiceResult.success(null);
    return bData;
  };

  function getResult(): ReturnType<A, B, K> {
    const record = getRecord();

    const key = keyFromAorB();
    const a = getA(record, key);
    const b = getB(record, key);

    return [key, a, b];
  }

  return getResult;
}
