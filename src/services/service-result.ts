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
