import type { Zaak } from "@/features/zaaksysteem/types";
import { defineStore } from "pinia";
import type { Klant, Medewerker, Contactverzoek } from "./types";
export * from "./types";

export type ContactmomentZaak = Zaak & { shouldStore: boolean };

interface ContactmomentState {
  contactmomentLoopt: boolean;
  zaken: ContactmomentZaak[];
  klanten: { klant: Klant; shouldStore: boolean }[];
  notitie: string;
  medewerkers: Medewerker[]; // hier zullen geselecteerde medewerkers uit de zoekresultaten bewaard moeten worde, zodat ze bij het contactmoment gebruikt kunnen worden (bv bij een terugbel notite)
  contactverzoek: Contactverzoek | undefined;
}

export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    return {
      contactmomentLoopt: false,
      zaken: <ContactmomentZaak[]>[],
      klanten: [],
      notitie: "",
      medewerkers: [],
      contactverzoek: undefined,
    } as ContactmomentState;
  },
  getters: {
    klant: (state): Klant | undefined =>
      state.klanten.filter((x) => x.shouldStore).map((x) => x.klant)[0],
  },
  actions: {
    start() {
      this.contactmomentLoopt = true;
    },
    stop() {
      this.contactmomentLoopt = false;
      this.medewerkers = [];
      this.klanten = [];
      this.zaken = [];
      this.notitie = "";
      this.contactverzoek = undefined;
    },
    toggleZaak(zaak: Zaak) {
      const contactmomentZaak = zaak as ContactmomentZaak;
      const index = this.zaken.findIndex((element) => element.id === zaak.id);
      if (index === -1) {
        //als de zaak nog niet gekoppeld was aan het contact moment dan voegen we hem eerst toe
        this.zaken.push(contactmomentZaak);
        contactmomentZaak.shouldStore = true;
        return true;
      } else {
        const existingZaak = this.zaken[index];
        //toggle of hij wel niet opgeslagen moet worden bij het contactmoment
        existingZaak.shouldStore = !existingZaak.shouldStore;
        return existingZaak.shouldStore;
      }
    },
    isZaakLinkedToContactmoment(id: string) {
      const zaak = this.zaken.find((element) => element.id === id);
      return zaak ? zaak.shouldStore : false;
    },
    setKlant(klant: Klant) {
      const match = this.klanten.find((x) => x.klant.id === klant.id);
      if (match?.shouldStore) return false;

      this.klanten.forEach((x) => {
        x.shouldStore = false;
      });

      if (match) {
        match.klant = klant;
        match.shouldStore = true;
      } else {
        this.klanten.push({
          shouldStore: true,
          klant,
        });
      }

      return true;
    },
    setNotitie(notitie: string) {
      this.notitie = notitie;
    },

    addMedewerker(medewerker: Medewerker) {
      if (this.medewerkers.some((x) => x.id === medewerker.id)) return;
      this.medewerkers.push(medewerker);
    },
  },
});
