import { watch, type Ref } from "vue";
import { useRouter } from "vue-router";

export function bindQueryForm<T>(el: Ref<T>) {
  const router = useRouter();

  function submitSearch(e: SubmitEvent) {
    e.preventDefault();
    const { currentTarget } = e;
    if (!(currentTarget instanceof HTMLFormElement)) return;
    const currentRoute = router.currentRoute.value;
    const formData = new FormData(currentTarget);
    const entries = Array.from(formData.entries()).map(([k, v]) => [
      k,
      v.toString(),
    ]);
    const params = Object.fromEntries(entries);
    const path = currentTarget.action || currentRoute.path;
    router.push({
      hash: currentRoute.hash,
      path,
      query: {
        ...currentRoute.query,
        ...params,
      },
    });
  }

  function onSearchInputReset(e: Event) {
    const { currentTarget } = e;
    if (!(currentTarget instanceof HTMLInputElement) || currentTarget.value)
      return;
    e.preventDefault();
    const { name } = currentTarget;
    if (typeof name !== "string" || !name) return;
    const currentRoute = router.currentRoute.value;
    if (!currentRoute.query[name]) return;
    router.push({
      ...currentRoute,
      query: {
        ...currentRoute.query,
        [name]: undefined,
      },
    });
  }
  const dispose = watch(el, (form) => {
    if (form instanceof HTMLFormElement) {
      form.onsubmit = submitSearch;
      for (const element of form.elements) {
        if (element instanceof HTMLInputElement && element.type === "search") {
          element.addEventListener("search", onSearchInputReset);
        }
      }
    }
    dispose();
  });

  watch([router.currentRoute, el], ([route, form]) => {
    if (!route || !form || !(form instanceof HTMLFormElement)) return;
    for (const element of form.elements) {
      if (!("value" in element) || !("name" in element)) {
        continue;
      }
      const { name } = element as any;
      const currentValue =
        typeof name === "string" && route.query?.[name]?.toString();
      (element as any).value = currentValue || "";
    }
  });
}
