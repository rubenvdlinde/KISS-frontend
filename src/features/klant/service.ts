import { ServiceResult } from "@/services";
import type { Klant } from "./types";

export function useKlantService() {
  const searchByEmail = (data: string) => {
    const url =
      window.gatewayBaseUri + "/klanten?extend=all&emailadres=" + data;

    const promise = fetch(url)
      .then((result) => {
        if (!result.ok) {
          throw new Error();
        }
        return result.json();
      })
      .then((jsonResult) => {
        return jsonResult.map((item: any) => {
          return (obj: any): Klant => {
            return {
              klantnummer: obj.klantnummer,
              voornaam: obj.voornaam,
              voorvoegselAchternaam: obj.voorvoegselAchternaam,
              achternaam: obj.achternaam,
              telefoonnummer: obj.telefoonnummer,
              emailadres: obj.emailadres,
            };
          };
        });
      });

    const state = ServiceResult.fromPromise(promise);

    return { state: state, promise: promise };
  };

  return {
    searchByEmail,
  };
}
