import { parsePagination, ServiceResult, type Paginated } from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Ref } from "vue";
import type {
  ContacmomentViewModel,
  Contactmoment,
  Gespreksresultaat,
} from "./types";

export function useContactmomentService() {
  if (!window.gatewayBaseUri) {
    console.error("gatewayBaseUri missing");
  }

  const contactmomentenUrl = window.gatewayBaseUri + "/api/contactmomenten";

  const gespreksResultatenBaseUri =
    window.gatewayBaseUri + "/api/ref/resultaattypeomschrijvingen";

  const save = (data: Contactmoment) => {
    return fetchLoggedIn(contactmomentenUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    });
  };

  const getGespreksResultaten = () => {
    const fetchBerichten = fetchLoggedIn(gespreksResultatenBaseUri)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            "Er is een fout opgetreden bij het laden van de gespreksresultaten"
          );
        }
        return r.json();
      })
      .then((json) => {
        const results = json?.results;
        if (!Array.isArray(results))
          throw new Error("unexpected json result: " + JSON.stringify(json));
        return results as Array<Gespreksresultaat>;
      });

    return ServiceResult.fromPromise(fetchBerichten);
  };

  return {
    save,
    getGespreksResultaten,
    // saveZaak,
  };
}

export function useKlantContactmomenten(id: Ref<string>) {
  const getUrl = () => {
    const { value } = id;
    if (!value) return "";

    const url = new URL(window.gatewayBaseUri + "/api/klantcontactmomenten");
    url.searchParams.set("klant.id", value);
    url.searchParams.set("extend[]", "contactmoment");
    url.searchParams.set("fields[]", "contactmoment");
    return url.toString();
  };

  return ServiceResult.fromFetcher(getUrl, fetchKlantContactmomenten);
}

function fetchKlantContactmomenten(
  url: string
): Promise<Paginated<ContacmomentViewModel>> {
  return fetchLoggedIn(url)
    .then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    })
    .then((json) => {
      return parsePagination(
        json,
        (x) => (x as any).contactmomment as ContacmomentViewModel
      );
    });
}
