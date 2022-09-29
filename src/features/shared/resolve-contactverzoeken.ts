import {
  fetchLoggedIn,
  parsePagination,
  throwIfNotOk,
  type Paginated,
} from "@/services";
import type {
  ContactmomentZaak,
  ContactmomentViewModel,
  ContactmomentContactverzoek,
} from "./types";

const mapZaak = (json: any): ContactmomentZaak => ({
  status: json?.embedded?.status?.statustoelichting,
  zaaktype: json?.embedded?.zaaktype?.onderwerp,
  zaaknummer: json?.identificatie,
});

const fixUrl = (object: string) =>
  object.startsWith("/") ? window.gatewayBaseUri + object : object;

const fetchObject = ({
  object,
  objectType,
}: {
  object: string;
  objectType: string;
}) =>
  fetchLoggedIn(fixUrl(object))
    .then(throwIfNotOk)
    .then((or) => or.json())
    .then((oj) => ({
      ...oj,
      objectType,
    }));

function mapContactverzoek(obj: any) {
  const url = (obj?.url as string) || "";
  const todo = obj?.embedded?.todo;
  const medewerkers = todo?.attendees ?? obj?.todo?.attendees ?? [];
  const completed = todo?.completed || "";
  return {
    url: url && fixUrl(url),
    medewerkers,
    completed: completed ? new Date(completed) : undefined,
    isContactverzoek: true as const,
  };
}

const mapContactmoment = async (r: any) => {
  if (r.embedded.contactmoment?.todo)
    return mapContactverzoek(r.embedded.contactmoment);
  const contactmoment = r.embedded.contactmoment as ContactmomentViewModel;
  contactmoment.startdatum = new Date(contactmoment.startdatum);
  contactmoment.registratiedatum = new Date(contactmoment.registratiedatum);

  const objectcontactmomenten: any[] =
    r.embedded.contactmoment?.embedded?.objectcontactmomenten ?? [];

  const zakenPromises = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "zaak")
    .map((x) => fetchObject(x).then(mapZaak));

  const contactverzoekenUrls = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "contactmomentobject")
    .map(({ object }) => fixUrl(object));

  return {
    ...contactmoment,
    zaken: await Promise.all(zakenPromises),
    contactverzoekenUrls,
    isContactverzoek: false as const,
  };
};

export const resolveContactverzoekenPaginated = async (
  json: unknown
): Promise<Paginated<ContactmomentViewModel>> => {
  const paginated = await parsePagination(json, mapContactmoment);
  const page = [] as ContactmomentViewModel[];
  paginated.page.forEach((obj) => {
    if (obj.isContactverzoek) return;

    const contactverzoeken = paginated.page.filter(
      (x) => x.isContactverzoek && obj.contactverzoekenUrls.includes(x.url)
    ) as ContactmomentContactverzoek[];

    page.push({
      ...obj,
      contactverzoeken,
    });
  });
  return {
    ...paginated,
    page,
  };
};
