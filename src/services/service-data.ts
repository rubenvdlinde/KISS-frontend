import { toReactive } from "@vueuse/core";
import useSWRV from "swrv";
import { reactive, computed, watch } from "vue";

const logError = import.meta.env.DEV
  ? (e: unknown) => console.error(e)
  : // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {};

// sometimes, a query can return one or zero results.
// in the case of zero results, we can NEVER return undefined from a fetcher.
// because in that case, there is no way to discern between a succesful query with zero results vs a failed or loading query.
export type NotUndefined<T> = NonNullable<T> | null;

export type ServiceData<T> =
  | {
      submitted: true;
      state: "loading";
      loading: true;
      success: false;
      error: false;
    }
  | {
      submitted: true;
      state: "error";
      error: Error;
      loading: false;
      success: false;
    }
  | {
      submitted: true;
      state: "success";
      data: T;
      loading: false;
      success: true;
      error: false;
    }
  | {
      submitted: false;
      state: "init";
      loading: false;
      success: false;
      error: false;
    };

export type Submitter<TIn, TOut> = ServiceData<TOut> & {
  submit: (params: TIn) => Promise<TOut>;
  reset: () => void;
};

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
    return {
      state: "success",
      data,
      error: false,
      success: true,
      loading: false,
      submitted: true,
    };
  },
  loading(): ServiceData<any> {
    return {
      state: "loading",
      error: false,
      success: false,
      loading: true,
      submitted: true,
    };
  },
  error(error: Error): ServiceData<any> {
    return reactive({
      state: "error",
      error,
      success: false,
      loading: false,
      submitted: true,
    });
  },
  init(): ServiceData<any> {
    return {
      state: "init",
      error: false,
      success: false,
      loading: false,
      submitted: false,
    };
  },

  fromPromise<T = unknown>(
    promise: Promise<NotUndefined<T>>
  ): ServiceData<T> & Promise<NotUndefined<T>> {
    const result = reactive(ServiceResult.loading());

    promise
      .then((r) => {
        Object.assign(result, {
          state: "success",
          data: r,
          loading: false,
          error: false,
          success: true,
          submitted: true,
        });
      })
      .catch((e) => {
        Object.assign(result, {
          state: "error",
          error: e instanceof Error ? e : new Error(e),
          loading: false,
          success: false,
          submitted: true,
        });
      });

    return Object.assign(result, promise);
  },

  fromSubmitter<TIn, TOut>(submitter: (params: TIn) => Promise<TOut>) {
    const result = reactive(ServiceResult.init());

    return Object.assign(result, {
      reset() {
        Object.assign(result, {
          state: "init",
          data: undefined,
          error: false,
          success: false,
          loading: false,
          submitted: false,
        });
      },
      submit(params: TIn): Promise<TOut> {
        Object.assign(result, {
          state: "loading",
          data: undefined,
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
              data: undefined,
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
  ): ServiceData<NotUndefined<T>> & { refresh: () => Promise<void> } {
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

    if (data.value === undefined && config?.initialData !== undefined) {
      data.value = config.initialData;
    }

    const requestId = computed(getRequestUniqueId);

    watch(requestId, (n, o) => {
      if (n && n !== o) {
        data.value = undefined;
      }
    });

    function getResult(): ServiceData<NotUndefined<T>> {
      const e = error.value;
      if (e) {
        logError(e);
        const errorInstance = e instanceof Error ? e : new Error(e);
        return ServiceResult.error(errorInstance);
      }
      if (!requestId.value) return ServiceResult.init();

      if (data.value !== undefined) return ServiceResult.success(data.value);

      if (isValidating.value) return ServiceResult.loading();

      return ServiceResult.init();
    }

    const comp = computed(getResult);
    const result = Object.assign(toReactive(comp), { refresh: () => mutate() });
    return result;
  },
};

export function mapServiceData<TIn, TOut>(
  input: ServiceData<TIn>,
  mapper: (i: TIn) => TOut
): ServiceData<TOut> {
  const result = computed(() =>
    !input.success
      ? input
      : {
          ...input,
          data: mapper(input.data),
        }
  );
  return toReactive(result);
}
