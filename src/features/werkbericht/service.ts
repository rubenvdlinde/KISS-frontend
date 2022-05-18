import type { Werkbericht } from "./types";
import { ServiceResult, type ServiceData } from "@/services";
import { parseDutchDate } from "@/services";

function parse(o: any): Werkbericht {
  if (
    typeof o?.title !== "string" ||
    typeof o?.content !== "string" ||
    typeof o?.date !== "string"
  ) {
    throw new Error("invalid werkbericht: " + JSON.stringify(o));
  }

  return {
    title: o.title,
    content: o.content,
    date: parseDutchDate(o.date),
  };
}

const fetchLatestNews = () =>
  fetch("http://localhost/api/nieuws")
    .then((r) => r.json())
    .then((json) => {
      const results = json?.results;
      if (!Array.isArray(results))
        throw new Error("unexpected json result: " + JSON.stringify(json));
      return results.map(parse);
    });

export function useLatestNews(): ServiceData<Werkbericht[]> {
  const promise = fetchLatestNews();
  return ServiceResult.fromPromise(promise);
}

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
