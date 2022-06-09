import {
  onUnmounted,
  reactive,
  readonly,
  watch,
  type UnwrapNestedRefs,
} from "vue";
import useSWRV from "swrv";

const logError = import.meta.env.DEV
  ? (e: unknown) => console.error(e)
  : // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};

type Result<T> =
  | {
      state: "loading";
    }
  | {
      state: "error";
      error: Error;
    }
  | {
      state: "success";
      data: T;
    };

export type ServiceData<T> = UnwrapNestedRefs<Result<T>>;

export type Paginated<T> = Readonly<{
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  page: T[];
}>;

export const emptyPage: Paginated<any> = {
  pageSize: 1,
  pageNumber: 1,
  totalPages: 1,
  page: [],
};

export const ServiceResult = {
  success<T>(data: T): ServiceData<T> {
    return reactive({
      state: "success",
      data,
      error: null,
    });
  },
  loading<T>(): ServiceData<T> {
    return reactive({
      state: "loading",
      data: null,
      error: null,
    });
  },
  error<T>(error: Error): ServiceData<T> {
    return reactive({
      state: "error",
      data: null,
      error,
    });
  },
  fromFetcher<T = unknown>(
    url: string | (() => string),
    fetcher: (url: string) => Promise<T>,
    initialData?: T
  ): ServiceData<T> {
    const result =
      initialData !== undefined
        ? ServiceResult.success<T>(initialData)
        : ServiceResult.loading<T>();

    const { data, error } = useSWRV<T, any>(url, fetcher, {
      refreshInterval: import.meta.env.VITE_API_REFRESH_INTERVAL_MS,
    });

    const dispose = watch(
      [data, error],
      ([d, e]) => {
        if (e) {
          logError(e);
          const errorInstance = e instanceof Error ? e : new Error(e);
          Object.assign(result, { state: "error", error: errorInstance });
          return;
        }
        if (d !== undefined) {
          Object.assign(result, {
            data: d,
            state: "success",
          });
        }
      },
      { immediate: true }
    );

    onUnmounted(dispose);

    return result;
  },
};

export function parseValidInt(input: unknown): number | undefined {
  if (typeof input === "number") {
    return isFinite(input) ? input : undefined;
  }
  if (typeof input !== "string") return undefined;
  const parsed = Number.parseInt(input, 10);
  return isFinite(parsed) ? parsed : undefined;
}

export function parseDutchDate(dateTimeStr: string): Date {
  const [dateStr, timeStr] = dateTimeStr.split(" ");
  const [year, day, month] = dateStr.split("-");
  const [hour, minute, second] = timeStr.split(":");

  const dateInput = [year, month, day, hour, minute, second].map(
    parseValidInt
  ) as [
    number,
    number,
    number,
    number | undefined,
    number | undefined,
    number | undefined
  ];

  //correct 0-based month
  dateInput[1] = dateInput[1] - 1;

  return new Date(...dateInput);
}

export interface LookupList<K, V> {
  fromKeyToValue: (key: K) => V | undefined;
  fromValueToKey: (value: V) => K | undefined;
}

export function createLookupList<K, V>(data: [K, V][]): LookupList<K, V> {
  const fromKeyToValueMap = new Map(data);
  const FromValueToKeyMap = new Map(data.map(([k, v]) => [v, k]));
  return {
    fromKeyToValue(key: K) {
      return fromKeyToValueMap.get(key);
    },
    fromValueToKey(val: V) {
      return FromValueToKeyMap.get(val);
    },
  };
}
