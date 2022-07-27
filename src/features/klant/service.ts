import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  defaultPagination,
  parsePagination,
} from "@/services";

import type { Ref } from "vue";
import type { Klant } from "@/stores/contactmoment";

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

const isEmail = (val: string) =>
  val.match(
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  );

type KlantSearchParameters = {
  search: Ref<string>;
  page: Ref<number | undefined>;
};

export function useKlanten(params: KlantSearchParameters) {
  function getUrl() {
    const search = params.search.value;

    if (!search) return "";

    const page = params.page?.value || 1;

    const url = new URL(`${window.gatewayBaseUri}/api/klanten`);
    url.searchParams.set("extend[]", "all");
    url.searchParams.set("page", page.toString());

    if (isEmail(search)) {
      url.searchParams.set("emailadres", search);
    } else {
      url.searchParams.set("telefoonnummer", search);
    }
    return url.toString();
  }

  return ServiceResult.fromFetcher(getUrl, searchKlanten);
}

export function useKlantDetails(id: Ref<string>) {
  const getUrl = () => `${window.gatewayBaseUri}/api/klanten/${id.value}`;
  return ServiceResult.fromFetcher(getUrl, fetchKlant);
}

function mapKlant(obj: any): Klant {
  return {
    id: obj.id,
    klantnummer: obj.klantnummer,
    voornaam: obj.voornaam,
    voorvoegselAchternaam: obj.voorvoegselAchternaam,
    achternaam: obj.achternaam,
    telefoonnummer: obj.telefoonnummer,
    emailadres: obj.emailadres,
  };
}

function fetchKlant(url: string) {
  return fetchLoggedIn(url)
    .then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    })
    .then(mapKlant);
}

function searchKlanten(url: string): Promise<Paginated<Klant>> {
  return fetchLoggedIn(url)
    .then((result) => {
      if (!result.ok) {
        throw new Error();
      }
      return result.json();
    })
    .then((jsonResult) => {
      //for testing multiple records
      return defaultPagination<Klant>([
        {
          id: "deb5046c-6ef8-424b-b6ce-94ecb27e9826",
          klantnummer: "111",
          voornaam: "vvv",
          achternaam: "kkk",
          telefoonnummer: "1111111",
          emailadres: "emailadres",
        },
        {
          id: "74cde8e5-c5f5-4f57-8cdb-e9679cbfa946",
          klantnummer: "111",
          voornaam: "vvv",
          achternaam: "kkk",
          telefoonnummer: "1111111",
          emailadres: "emailadres",
        },
        {
          id: "cab7f6bf-27ab-41ec-a448-aa5107d8aa20",
          klantnummer: "111",
          voornaam: "vvv",
          achternaam: "kkk",
          telefoonnummer: "1111111",
          emailadres: "emailadres",
        },
      ]);

      return parsePagination(jsonResult, mapKlant);
    });
}
