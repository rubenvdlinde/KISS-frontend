import useSWRV from "swrv";
import {
  type UnwrapNestedRefs,
  reactive,
  watch,
  onUnmounted,
  type UnwrapRef,
  computed,
  toRefs,
} from "vue";

const logError = import.meta.env.DEV
  ? (e: unknown) => console.error(e)
  : // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};

// sometimes, a query can return one or zero results.
// in the case of zero results, we can NEVER return undefined from a fetcher.
// because in that case, there is no way to discern between a succesful query with zero results vs a failed or loading query.
export type NotUndefined<T> = NonNullable<T> | null;

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
export type Submitter<TIn, TOut> = (
  | (ServiceData<TOut> & { submitted: true })
  | {
      submitted: false;
      state: "init";
      loading: false;
      success: false;
      error: false;
    }
) & { submit: (params: TIn) => Promise<TOut>; reset: () => void };
interface FetcherConfig<T = unknown> {
  /**
   * data to initialize the ServiceData, so we won't start with a loading state.
   */
  initialData?: T;
  /**
   * if the url alone is not enough to identify a unique request, you can supply a function that does this in stead.
   */
  getUniqueId?: () => string;
  poll?: true;
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
  init<T>(): ServiceData<T> | { submitted: false; state: "init" } {
    return reactive({
      state: "init",
      data: null,
      error: false,
      success: false,
      loading: false,
      submitted: false,
    });
  },

  fromPromise<T = unknown>(promise: Promise<T>): ServiceData<T> & Promise<T> {
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

    return Object.assign(result, promise);
  },

  fromSubmitter<TIn, TOut>(submitter: (params: TIn) => Promise<TOut>) {
    const result = ServiceResult.init<TOut>();
    return Object.assign(result, {
      reset() {
        Object.assign(result, {
          state: "init",
          data: null,
          error: false,
          success: false,
          loading: false,
          submitted: false,
        });
      },
      submit(params: TIn): Promise<TOut> {
        Object.assign(result, {
          state: "loading",
          data: null,
          error: false,
          success: false,
          loading: true,
          submitted: true,
        });
        return submitter(params)
          .then((r) => {
            Object.assign(result, {
              state: "success",
              data: r,
              loading: false,
              error: false,
              success: true,
            });
            return r;
          })
          .catch((e) => {
            Object.assign(result, {
              state: "error",
              error: e instanceof Error ? e : new Error(e),
              loading: false,
              success: false,
            });
            throw e;
          });
      },
    }) as Submitter<TIn, TOut>;
  },

  /**
   * @param url either the url or a function to return a dynamic url. this is also used to identify a unique request, unless you supply a function to do this in the config.
   * @param fetcher a function to fetch the data
   * @param config optional configuration for the fetcher
   */
  fromFetcher<T>(
    url: string | (() => string),
    fetcher: (url: string) => Promise<NotUndefined<T>>,
    config?: FetcherConfig<T>
  ): ServiceData<T> & { refresh: () => void } {
    const result =
      config?.initialData !== undefined
        ? ServiceResult.success<T>(config.initialData)
        : ServiceResult.loading<T>();

    const getUrl = typeof url === "string" ? () => url : url;
    const getRequestUniqueId = config?.getUniqueId || getUrl;
    const fetcherWithoutParameters = () => fetcher(getUrl());

    const { data, error, isValidating, mutate } = useSWRV<NotUndefined<T>, any>(
      getRequestUniqueId,
      fetcherWithoutParameters,
      {
        refreshInterval: config?.poll
          ? import.meta.env.VITE_API_REFRESH_INTERVAL_MS
          : undefined,
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

    return Object.assign(result, { refresh: mutate });
  },
};

export function mapServiceData<TIn, TOut>(
  input: ServiceData<TIn>,
  mapper: (i: UnwrapRef<TIn>) => TOut
): ServiceData<TOut> {
  const data = computed(() => (input.success ? mapper(input.data) : undefined));
  return reactive({ ...toRefs(input), data }) as ServiceData<TOut>;
}
