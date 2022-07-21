import { ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Klant } from "./types";

const apiUrl = `${window.gatewayBaseUri}/api/klanten`;

export function useKlantService() {
  const searchByEmail = (data: string) =>
    searchKlant(`${apiUrl}?extend=all&emailadres=${data}`);

  const searchByTelnr = (data: string) =>
    searchKlant(`${apiUrl}?extend=all&telefoonnummer=${data}`);

  return {
    searchByEmail,
    searchByTelnr,
  };
}

function searchKlant(url: string) {
  const promise = fetchLoggedIn(url)
    .then((result) => {
      if (!result.ok) {
        throw new Error();
      }
      return result.json();
    })
    .then((jsonResult) => {
      if (!jsonResult.results)
        throw new Error(
          "Invalide response, ontbrekende property 'results'" +
            JSON.stringify(jsonResult)
        );

      if (!Array.isArray(jsonResult.results))
        throw new Error(
          "Invalide response, verwacht een lijst: " +
            JSON.stringify(jsonResult.results)
        );

      return jsonResult.results.map((obj: any): Klant => {
        return {
          klantnummer: obj.klantnummer,
          voornaam: obj.voornaam,
          voorvoegselAchternaam: obj.voorvoegselAchternaam,
          achternaam: obj.achternaam,
          telefoonnummer: obj.telefoonnummer,
          emailadres: obj.emailadres,
        };
      });
    });

  const state = ServiceResult.fromPromise(promise);

  return { state: state, promise: promise };
}
