import { ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Klant } from "./types";

const apiUrl = `${window.gatewayBaseUri}/api/klanten`;

export function useKlantService() {
  const searchByEmail = (data: string) =>
    searchKlant(`${apiUrl}?extend=all&emailadres=${data}`);

  const searchByTelnr = (data: string) =>
    searchKlant(`${apiUrl}?extend=all&telefoonnummer=${data}`);

  const getKlant = (klantnummer: string) => {
    // er zijn endpoints voor het ophalen van:
    //  - een klant /api/klanten/{uuid}
    //  - contactmomenten van een klant /api/klantcontactmomenten
    // -  zaken bij contactmomenten /api/objectcontactmomenten

    //onduidelijk wat we nu moeten gebruiken voor het opbouwen van het klantbeeld
    //idiealiter alleen een call naar /api/klanten/{uuid} met ?extend[]=all
    //en dan in een keer alles binnenkrijgen. Kan dat?? zo ja, testdata svp

    //als dat niet kan, zouden we ook de andere calls kunnen gebruiken,
    //maar daar heb ik ook een paar vragen over:
    //in de docs voor het ophalen van klantcontactmometen staan een aantal queryparemeters als 'verplicht' (https://redocly.github.io/redoc/?nocors&url=https://kissdevelopment-dimpact.commonground.nu/openapi.json#tag/KlantContactMoment-contactmomenten-collection/operation/klantcontactmomenten%20KlantContactMoment_get)
    //klopt dat? krijg geen error als ik die niet gebruik
    //zit er nu geen testdata in of is de query fout? als ik hem toepas voor de testklant krijg ik niets terug:
    //https://kissdevelopment-dimpact.commonground.nu/api/klantcontactmomenten?klant.bronorganisatie=999990639&klant.klantnummer=00000221&klant.websiteUrl=/api/KlantAdres/96a1cbcd-3ac3-415f-a62b-0c5270bfae59&contactmoment.bronorganisatie=999990639&rol=gesprekspartner&extend[]=ContactMoment

    const promise = fetchLoggedIn("???").then((result) => {
      if (!result.ok) {
        throw new Error();
      }
      return result.json();
    });

    const state = ServiceResult.fromPromise(promise);

    return { state: state, promise: promise };
  };

  return {
    searchByEmail,
    searchByTelnr,
    getKlant,
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

      //for testing multiple records
      // return [
      //   {
      //     klantnummer: "111",
      //     voornaam: "vvv",
      //     voorvoegselAchternaam: null,
      //     achternaam: "kkk",
      //     telefoonnummer: "1111111",
      //     emailadres: "emailadres",
      //   },
      //   {
      //     klantnummer: "111",
      //     voornaam: "vvv",
      //     voorvoegselAchternaam: null,
      //     achternaam: "kkk",
      //     telefoonnummer: "1111111",
      //     emailadres: "emailadres",
      //   },
      //   {
      //     klantnummer: "111",
      //     voornaam: "vvv",
      //     voorvoegselAchternaam: null,
      //     achternaam: "kkk",
      //     telefoonnummer: "1111111",
      //     emailadres: "emailadres",
      //   },
      // ];

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
