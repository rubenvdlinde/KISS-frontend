import { ServiceResult, type ServiceData } from "@/services";

type Either<A, B> = Readonly<[A, undefined] | [undefined, B]>;

export function useEnricher<A, B, Y>(
  getRecord: () => Either<A, B>,
  getKey: (ab: A | B) => Y | undefined,
  getAData: (key: () => Y | undefined) => ServiceData<A | undefined>,
  getBData: (key: () => Y | undefined) => ServiceData<B | undefined>
): () => readonly [
  Y | undefined,
  ServiceData<A | undefined>,
  ServiceData<B | undefined>
] {
  const getAorB = () => {
    const [a, b] = getRecord();
    if (a === undefined) return b as B;
    return a as A;
  };
  const keyFromAorB = () => getKey(getAorB());
  const aData = getAData(keyFromAorB);
  const bData = getBData(keyFromAorB);

  const getA = (
    [a]: Either<A, B>,
    k: Y | undefined
  ): ServiceData<A | undefined> => {
    if (a) return ServiceResult.success(a);
    if (!k) return ServiceResult.success(undefined);
    return aData;
  };

  const getB = (
    either: Either<A, B>,
    k: Y | undefined
  ): ServiceData<B | undefined> => {
    const b = either[1];
    if (b) return ServiceResult.success(b);
    if (!k) return ServiceResult.success(undefined);
    return bData;
  };

  return () => {
    const record = getRecord();

    const key = keyFromAorB();
    const a = getA(record, key);
    const b = getB(record, key);

    return [key, a, b];
  };
}
