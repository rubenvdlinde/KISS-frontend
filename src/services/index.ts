import { onUnmounted, reactive, watch, type UnwrapNestedRefs } from "vue";
import useSWRV from "swrv";

export * from "./fetch-logged-in";

const logError = import.meta.env.DEV
  ? (e: unknown) => console.error(e)
  : // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};

type Result<T> =
  | {
      state: "loading";
      loading: true;
      success: false;
      error: false;
    }
  | {
      state: "error";
      error: Error;
      loading: false;
      success: false;
    }
  | {
      state: "success";
      data: T;
      loading: false;
      success: true;
      error: false;
    };

export type ServiceData<T> = UnwrapNestedRefs<Result<T>>;

export interface Paginated<T> {
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  totalRecords?: number;
  page: T[];
}

interface FetcherConfig<T = unknown> {
  /**
   * data to initialize the ServiceData, so we won't start with a loading state.
   */
  initialData?: T;
  /**
   * if the url alone is not enough to identify a unique request, you can supply a function that does this in stead.
   */
  getUniqueId?: () => string;
}

export const ServiceResult = {
  success<T>(data: T): ServiceData<T> {
    return reactive({
      state: "success",
      data,
      error: false,
      success: true,
      loading: false,
    });
  },
  loading<T>(): ServiceData<T> {
    return reactive({
      state: "loading",
      data: null,
      error: false,
      success: false,
      loading: true,
    });
  },
  error<T>(error: Error): ServiceData<T> {
    return reactive({
      state: "error",
      data: null,
      error,
      success: false,
      loading: false,
    });
  },

  fromPromise<T = unknown>(promise: Promise<T>) {
    const result = ServiceResult.loading<T>();

    promise
      .then((r) => {
        Object.assign(result, {
          state: "success",
          data: r,
          loading: false,
          error: false,
          success: true,
        });
      })
      .catch((e) => {
        Object.assign(result, {
          state: "error",
          error: e instanceof Error ? e : new Error(e),
          loading: false,
          success: false,
        });
      });

    return result;
  },

  /**
   * @param url either the url or a function to return a dynamic url. this is also used to identify a unique request, unless you supply a function to do this in the config.
   * @param fetcher a function to fetch the data
   * @param config optional configuration for the fetcher
   */
  fromFetcher<T = unknown>(
    url: string | (() => string),
    fetcher: (url: string) => Promise<T>,
    config?: FetcherConfig<T>
  ): ServiceData<T> {
    const result =
      config?.initialData !== undefined
        ? ServiceResult.success<T>(config.initialData)
        : ServiceResult.loading<T>();

    const getUrl = typeof url === "string" ? () => url : url;
    const getRequestUniqueId = config?.getUniqueId || getUrl;
    const fetcherWithoutParameters = () => fetcher(getUrl());

    const { data, error, isValidating } = useSWRV<T, any>(
      getRequestUniqueId,
      fetcherWithoutParameters,
      {
        refreshInterval: import.meta.env.VITE_API_REFRESH_INTERVAL_MS,
      }
    );

    const dispose1 = watch(
      [data, error],
      ([d, e]) => {
        if (e) {
          logError(e);
          const errorInstance = e instanceof Error ? e : new Error(e);
          Object.assign(result, {
            state: "error",
            error: errorInstance,
            loading: false,
            success: false,
          });
          return;
        }
        if (d !== undefined) {
          Object.assign(result, {
            data: d,
            state: "success",
            loading: false,
            error: false,
            success: true,
          });
        }
      },
      { immediate: true }
    );

    // als het uniqueId wijzigt, wordt er nieuwe data opgehaald.
    // dat betekent dat we weer even in de loading state moeten raken.
    const dispose2 = watch(getRequestUniqueId, (uid) => {
      if (uid && isValidating.value) {
        Object.assign(result, {
          state: "loading",
          loading: true,
          error: false,
          success: false,
        });
      }
    });

    onUnmounted(() => {
      dispose1();
      dispose2();
    });

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

export function parseValidUrl(input: unknown): URL | undefined {
  if (input instanceof URL) return input;
  if (typeof input !== "string") return undefined;
  try {
    return new URL(input);
  } catch (error) {
    return undefined;
  }
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
  entries: [K, V][];
}

export function createLookupList<K, V>(entries: [K, V][]): LookupList<K, V> {
  const fromKeyToValueMap = new Map(entries);
  const FromValueToKeyMap = new Map(entries.map(([k, v]) => [v, k]));
  return {
    fromKeyToValue(key: K) {
      return fromKeyToValueMap.get(key);
    },
    fromValueToKey(val: V) {
      return FromValueToKeyMap.get(val);
    },
    entries,
  };
}
