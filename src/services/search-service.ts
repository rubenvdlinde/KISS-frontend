import type { ServiceData } from "@/types/service";
import type WerkBericht from "@/types/werk-bericht";
import { ref, computed, type Ref } from "vue";
import { useLatestNews } from "./news-service";
import { useLatestWorkInstructions } from "./work-instructions-service";

const { data: news, loading: newsLoading } = useLatestNews();
const { data: instructions, loading: instructionsLoading } =
  useLatestWorkInstructions();

export function useSearchWorkMessages(
  search: Ref<string | undefined>
): ServiceData<Array<WerkBericht & { type: string }>> {
  return {
    loading: computed(() => newsLoading.value || instructionsLoading.value),
    error: ref(),
    data: computed(() =>
      !search.value
        ? []
        : [
            ...instructions.value.map((x) => ({
              ...x,
              type: "Werkinstructie",
            })),
            ...news.value.map((x) => ({
              ...x,
              type: "Nieuws",
            })),
          ].sort((a, b) => b.date.valueOf() - a.date.valueOf())
    ),
  };
}
