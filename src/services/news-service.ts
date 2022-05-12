import type { ServiceData } from "@/types/service";
import type WerkBericht from "@/types/werk-bericht";
import { ref } from "vue";

export function useLatestNews(): ServiceData<WerkBericht[]> {
  return {
    loading: ref(false),
    error: ref(),
    data: ref([
      {
        title: "Daphne Jubilaris",
        date: new Date(2022, 1, 2, 12),
        content:
          "Daphne werkt vandaag alweer 10 jaar bij het KCC team. Gefeliciteerd met het jubileum! Er staat taart bij de koffieautomaat.",
      },
      {
        title: "Aanpak wateroverlast",
        date: new Date(2022, 1, 1, 12),
        content:
          "In de week van maandag 30 mei gaat Weg- en Waterbouw aan de slag in de Voorstraat, om de oorzaak van de wateroverlast te verhelpen. Er zijn bewonersbrieven rondgestuurd, die staan ook op onze website.",
      },
    ]),
  };
}
