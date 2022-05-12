import type { ServiceData } from "@/types/service";
import type WerkBericht from "@/types/werk-bericht";
import { ref } from "vue";

export function useLatestWorkInstructions(): ServiceData<WerkBericht[]> {
  return {
    loading: ref(false),
    error: ref(),
    data: ref([
      {
        title: "Mondkapjes",
        date: new Date(2022, 1, 2, 12),
        content:
          "Draag een mondkapje op de werkvloer bij verplaatsing door het gebouw en daar waar geen 1,5 meter afstand kan worden gehouden. Bijvoorbeeld als je naar een vergaderkamer gaat, of alf je koffie gaat halen.",
      },
      {
        title: "Let op Whatsapp",
        date: new Date(2022, 1, 1, 12),
        content:
          "Let vandaag goed op tijdige beantwoording van de Whatsapp-berichten. We krijgen steeds meer meldingen van burgers die meer dan 10 minuten moeten wachten op antwoord. We can do this! Groet, Marc",
      },
    ]),
  };
}
