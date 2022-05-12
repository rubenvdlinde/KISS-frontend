import type Werkbericht from "@/types/werk-bericht";
import { ServiceResult, type ServiceData } from "./service-result";

export function useLatestWorkInstructions(): ServiceData<Werkbericht[]> {
  return ServiceResult.success([
    {
      title: "Mondkapjes",
      date: new Date(2022, 1, 2, 12),
      content:
        "<p>Draag een mondkapje op de werkvloer bij verplaatsing door het gebouw en daar waar geen 1,5 meter afstand kan worden gehouden. Bijvoorbeeld als je naar een vergaderkamer gaat, of alf je koffie gaat halen.</p>",
    },
    {
      title: "Let op Whatsapp",
      date: new Date(2022, 1, 1, 12),
      content:
        "<p>Let vandaag goed op tijdige beantwoording van de Whatsapp-berichten. We krijgen steeds meer meldingen van burgers die meer dan 10 minuten moeten wachten op antwoord. We can do this! Groet, Marc</p>",
    },
  ]);
}
