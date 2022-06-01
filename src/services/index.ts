import { onUnmounted, reactive, watch, type UnwrapNestedRefs } from "vue";
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
  fromFetcher<T = unknown, S extends string = string>(
    url: S,
    fetcher: (url: S) => Promise<T>,
    initialData?: T
  ): ServiceData<T> {
    const result =
      initialData !== undefined
        ? ServiceResult.success<T>(initialData)
        : ServiceResult.loading<T>();

    const { data, error } = useSWRV<T, any>(url, fetcher, {
      refreshInterval: import.meta.env.VITE_API_REFRESH_INTERVAL_MS,
    });

    const dispose = watch([data, error], ([d, e]) => {
      if (e) {
        logError(e);
        const errorInstance = e instanceof Error ? e : new Error(e);
        Object.assign(result, { state: "error", error: errorInstance });
        return;
      }
      if (d) {
        Object.assign(result, {
          data: d,
          state: "success",
        });
      }
    });

    onUnmounted(dispose);

    return result;
  },
};

function parseValidInt(input: unknown): number | undefined {
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
