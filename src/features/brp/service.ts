import type { Persoon } from "./types";

export function useBrpService() {
  if (!window.gatewayBaseUri) {
    console.error("gatewayBaseUri missing");
  }

  const brpBaseUri = window.gatewayBaseUri + "/api/ingeschrevenpersonen";

  //zoeken op geboortedatum wordt nog niet ondersteund in de api, daarom tijdelijk disabled
  // const findByNameAndBirthDay = (achternaam: string, geboortedatum: string) => {
  //   const url = `${brpBaseUri}?naam__geslachtsnaam=${achternaam}&geboorte__datum=${geboortedatum}`;

  //   return fetch(url, {
  //     headers: {
  //       Accept: "application/json+ld",
  //     },
  //   })
  //     .then((r) => {
  //       if (!r.ok) {
  //         throw new Error();
  //       }
  //       return r.json();
  //     })

  //     .then((json) => {
  //       return json.map((x: Persoon) => {
  //         return { achternaam: x.achternaam } as Persoon;
  //       });
  //     });
  // };

  const findByPostalcodeAndHouseNumber = (
    postcode: string,
    huisnummer: string
  ) => {
    const url = `${brpBaseUri}?verblijfplaats__postcode=${postcode}&verblijfplaats__huisnummer=${huisnummer}&extend[]=all`;

    return fetch(url, { credentials: "include" })
      .then((r) => {
        if (!r.ok) {
          throw new Error();
        }
        return r.json();
      })

      .then((json) => {
        if (!Array.isArray(json.results)) {
          throw new Error(
            "Invalide json, verwacht een lijst: " + JSON.stringify(json.results)
          );
        }
        return json.results.map(
          (x: {
            id: string;
            burgerservicenummer: string;
            leeftijd: number;
            embedded: {
              naam: {
                voornamen: string;
                voorvoegsel: string;
                geslachtsnaam: string;
              };
            };
          }) => {
            //als er geen bsn bekend is hebben we er niets aan
            const bsnNumber = parseInt(x.burgerservicenummer);
            if (isNaN(bsnNumber)) {
              return;
            }

            return {
              id: x.id,
              voornamen: x.embedded.naam.voornamen,
              voorvoegsel: x.embedded.naam.voorvoegsel,
              achternaam: x.embedded.naam.geslachtsnaam,
              leeftijd: x.leeftijd,
              bsn: bsnNumber,
            } as Persoon;
          }
        );
      });
  };

  return {
    // findByNameAndBirthDay,
    findByPostalcodeAndHouseNumber,
  };
}
