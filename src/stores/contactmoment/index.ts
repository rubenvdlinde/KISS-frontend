import type { Klant } from "@/features/klant/types";
import type {
  Medewerker,
  Website,
  Kennisartikel,
  Nieuwsbericht,
  Werkinstructie,
} from "@/features/search/types";
import type { Zaak } from "@/features/zaaksysteem/types";
import { getFormattedUtcDate } from "@/services";
import { defineStore } from "pinia";
import { resetAllState } from "../create-store";
export * from "./types";

export type ContactmomentZaak = { zaak: Zaak; shouldStore: boolean };
export type ContactmomentContactVerzoek = {
  url: string;
  medewerker: string;
  isInProgress: boolean;
  isSubmitted: boolean;
};

export interface Vraag {
  zaken: ContactmomentZaak[];
  notitie: string;
  contactverzoek: ContactmomentContactVerzoek;
  startdatum: string;
  kanaal: string;
  resultaat: string;
  klanten: { klant: Klant; shouldStore: boolean }[];
  medewerkers: { medewerker: Medewerker; shouldStore: boolean }[];
  websites: { website: Website; shouldStore: boolean }[];
  kennisartikelen: { kennisartikel: Kennisartikel; shouldStore: boolean }[];
  nieuwsberichten: { nieuwsbericht: Nieuwsbericht; shouldStore: boolean }[];
  werkinstructies: { werkinstructie: Werkinstructie; shouldStore: boolean }[];
}

function initVraag(): Vraag {
  return {
    zaken: [],
    notitie: "",
    contactverzoek: {
      url: "",
      medewerker: "",
      isInProgress: false,
      isSubmitted: false,
    },
    startdatum: getFormattedUtcDate(),
    kanaal: "",
    resultaat: "",
    klanten: [],
    medewerkers: [],
    websites: [],
    kennisartikelen: [],
    nieuwsberichten: [],
    werkinstructies: [],
  };
}

interface ContactmomentState {
  contactmomentLoopt: boolean;
  vragen: Vraag[];
  huidigeVraag: Vraag;
}

export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    const huidigeVraag = initVraag();
    return {
      contactmomentLoopt: false,
      vragen: [huidigeVraag],
      huidigeVraag,
    } as ContactmomentState;
  },
  getters: {
    klantVoorHuidigeVraag(state): Klant | undefined {
      return state.huidigeVraag.klanten
        ?.filter((x) => x.shouldStore)
        ?.map((x) => x.klant)?.[0];
    },
    wouldLoseProgress(): boolean {
      return this.huidigeVraag.contactverzoek.isInProgress;
    },
  },
  actions: {
    start() {
      if (this.contactmomentLoopt) return;
      this.contactmomentLoopt = true;
    },
    startNieuweVraag() {
      const nieuweVraag = initVraag();
      if (this.huidigeVraag.klanten) {
        nieuweVraag.klanten = this.huidigeVraag.klanten.map(
          (klantKoppeling) => ({
            ...klantKoppeling,
          })
        );
      }
      this.vragen.push(nieuweVraag);
      this.switchVraag(nieuweVraag);
    },
    switchVraag(vraag: Vraag) {
      this.huidigeVraag = vraag;
    },
    stop() {
      this.$reset();
      // Temporary. When we implement multiple running contactmomenten, each will have it's own state
      resetAllState();
    },
    upsertZaak(zaak: Zaak, vraag: Vraag, shouldStore = true) {
      const existingZaak = vraag.zaken.find(
        (contacmomentZaak) => contacmomentZaak.zaak.id === zaak.id
      );

      if (existingZaak) {
        existingZaak.zaak = zaak;
        existingZaak.shouldStore = shouldStore;
        return;
      }

      //als de zaak nog niet gekoppeld was aan het contact moment dan voegen we hem eerst toe
      vraag.zaken.push({
        zaak,
        shouldStore,
      });
    },
    isZaakLinkedToContactmoment(id: string, vraag: Vraag) {
      return vraag.zaken.some(
        ({ zaak, shouldStore }) => shouldStore && zaak.id === id
      );
    },

    setKlant(klant: Klant) {
      if (!this.huidigeVraag) return;
      const match = this.huidigeVraag.klanten.find(
        (x) => x.klant.id === klant.id
      );

      this.huidigeVraag.klanten.forEach((x) => {
        x.shouldStore = false;
      });

      if (match) {
        match.klant = klant;
        match.shouldStore = true;
        return;
      }

      this.huidigeVraag.klanten.push({
        shouldStore: true,
        klant,
      });
    },

    addMedewerker(medewerker: any) {
      this.huidigeVraag.medewerkers.forEach(
        (m) => (m.shouldStore = m.medewerker.id === medewerker.id)
      );

      const newMedewerkerIndex = this.huidigeVraag.medewerkers.findIndex(
        (m) => m.medewerker.id === medewerker.id
      );

      if (newMedewerkerIndex === -1) {
        this.huidigeVraag.medewerkers.push({
          medewerker: {
            id: medewerker.id,
            voornaam: medewerker.contact.voornaam,
            voorvoegselAchternaam: medewerker.contact.voorvoegselAchternaam,
            achternaam: medewerker.contact.achternaam,
            emailadres: medewerker.contact.emailadres,
          },
          shouldStore: true,
        });
      }
    },

    addKennisartikel(kennisartikel: any) {
      this.huidigeVraag.kennisartikelen.forEach(
        (k) => (k.shouldStore = k.kennisartikel.url === kennisartikel.url)
      );

      const newKennisartikelIndex = this.huidigeVraag.kennisartikelen.findIndex(
        (k) => k.kennisartikel.url === kennisartikel.url
      );

      if (newKennisartikelIndex === -1) {
        this.huidigeVraag.kennisartikelen.push({
          kennisartikel: {
            title:
              kennisartikel.vertalingen[0]?.productTitelDecentraal ??
              "Onbekende titel",
            url: kennisartikel.url,
          },
          shouldStore: true,
        });
      }
    },

    addWebsite(website: Website) {
      this.huidigeVraag.websites.forEach(
        (w) => (w.shouldStore = w.website.url === website.url)
      );

      const newWebsiteIndex = this.huidigeVraag.websites.findIndex(
        (w) => w.website.url === website.url
      );

      if (newWebsiteIndex === -1) {
        this.huidigeVraag.websites.push({ website, shouldStore: true });
      }
    },

    toggleNieuwsbericht(nieuwsbericht: Nieuwsbericht) {
      const foundBerichtIndex = this.huidigeVraag.nieuwsberichten.findIndex(
        (n) => n.nieuwsbericht.url === nieuwsbericht.url
      );

      if (foundBerichtIndex !== -1) {
        this.huidigeVraag.nieuwsberichten.splice(foundBerichtIndex, 1);
        return;
      }

      this.huidigeVraag.nieuwsberichten.push({
        nieuwsbericht,
        shouldStore: true,
      });
    },

    toggleWerkinstructie(werkinstructie: Werkinstructie) {
      const foundWerkinstructieIndex =
        this.huidigeVraag.werkinstructies.findIndex(
          (w) => w.werkinstructie.url === werkinstructie.url
        );

      if (foundWerkinstructieIndex !== -1) {
        this.huidigeVraag.werkinstructies.splice(foundWerkinstructieIndex, 1);
        return;
      }

      this.huidigeVraag.werkinstructies.push({
        werkinstructie,
        shouldStore: true,
      });
    },
  },
});
