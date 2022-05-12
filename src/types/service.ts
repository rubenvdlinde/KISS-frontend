import type { DeepReadonly, Ref } from "vue";

export type ServiceData<T> = {
  loading: DeepReadonly<Ref<boolean>>;
  error: DeepReadonly<Ref<Error | undefined>>;
  data: DeepReadonly<Ref<T>>;
};
