import {
  inject,
  onUnmounted,
  provide,
  watch,
  type InjectionKey,
  reactive,
  computed,
  ref,
} from "vue";

type ValidationMessages = Map<string, string[]>;

const injectionKey = Symbol() as InjectionKey<ValidationMessages>;

export function useValidationMessages(props: {
  name: string;
  modelValue: string;
  validate?: (m: string) => string[];
}): { value: ReadonlyArray<string> } {
  const map = inject(injectionKey);
  if (!map) throw new Error("map not found");
  const messages = ref<string[]>([]);

  const dispose1 = watch(
    [() => props.modelValue, () => props.validate],
    ([value, validate]) => {
      messages.value = validate?.(value) ?? [];
    },
    { immediate: true }
  );

  const dispose2 = watch(
    [() => props.name, messages],
    ([newName, newMessages], [oldName]) => {
      map.set(newName, newMessages);
      if (oldName && oldName !== newName) {
        map.delete(oldName);
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    dispose1();
    dispose2();
    map.delete(props.name);
  });

  return messages;
}

export function provideValidationMessages() {
  const map = reactive(new Map<string, string[]>());
  provide(injectionKey, map);
  return computed<ReadonlyArray<string>>(() => [...map.values()].flat());
}
