import { reactive, type UnwrapNestedRefs } from "vue";

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
  fromPromise<T>(promise: Promise<T>, initialData?: T): ServiceData<T> {
    const result =
      initialData !== undefined
        ? ServiceResult.success<T>(initialData)
        : ServiceResult.loading<T>();

    promise
      .then((data) => {
        Object.assign(result, {
          data,
          state: "success",
        });
      })
      .catch((reason) => {
        const error = reason instanceof Error ? reason : new Error(reason);
        Object.assign(result, {
          state: "error",
          error,
        });
      });

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
  ) as [number, number, number, number, number, number];

  //correct 0-based month
  dateInput[1] = dateInput[1] - 1;

  return new Date(...dateInput);
}
