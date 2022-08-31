import { nanoid } from "nanoid";
import {
  inject,
  onUnmounted,
  provide,
  watch,
  type InjectionKey,
  reactive,
  computed,
  ref,
  readonly,
} from "vue";

type ValidationMessages = Map<string, readonly string[]>;

const injectionKey = Symbol() as InjectionKey<ValidationMessages>;

export function useValidationMessages(props: {
  value: string;
  validate: (m: string) => string[];
}) {
  const map = inject(injectionKey);
  if (!map) throw new Error("map not found");

  const id = nanoid();
  const messages = computed<ReadonlyArray<string>>(() =>
    props.validate(props.value)
  );

  const isDirty = ref(false);

  const inputProps = computed(() => ({
    "aria-describedBy": id,
    "aria-invalid": messages.value.length > 0,
    onBlur() {
      isDirty.value = true;
    },
  }));

  const disposeWatcher = watch(
    [messages],
    ([newMessages]) => {
      map.set(id, newMessages);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    disposeWatcher();
    map.delete(id);
  });

  return {
    id,
    messages,
    inputProps,
    isDirty: readonly(isDirty),
  };
}

export function provideValidationMessages() {
  const map = reactive(new Map<string, string[]>());
  provide(injectionKey, map);
  return computed<ReadonlyArray<string>>(() => [...map.values()].flat());
}
