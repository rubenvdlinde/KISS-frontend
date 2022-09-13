import type { Klant } from "@/features/klant/types";
import type { Zaak } from "@/features/zaaksysteem/types";
import { getFormattedUtcDate } from "@/services";
import { defineStore } from "pinia";
import { resetAllState } from "../create-store";
export * from "./types";

export type ContactmomentZaak = Zaak & { shouldStore: boolean };

interface Vraag {
  zaken: ContactmomentZaak[];
  klanten: { klant: Klant; shouldStore: boolean }[];
  notitie: string;
  contactverzoek: { url: string; medewerker: string } | undefined;
  startdatum: string;
}

interface ContactmomentState {
  contactmomentLoopt: boolean;
  vragen: Vraag[];
  huidigeVraag: Vraag | undefined;
}

export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    return {
      contactmomentLoopt: false,
      vragen: [],
      huidigeVraag: undefined,
    } as ContactmomentState;
  },
  getters: {
    klanten: (state) => state.huidigeVraag?.klanten ?? [],
    klant(): Klant | undefined {
      return this.klanten
        ?.filter((x) => x.shouldStore)
        ?.map((x) => x.klant)?.[0];
    },
    zaken: (state) => state.huidigeVraag?.zaken ?? [],
    notitie: (state) => state.huidigeVraag?.notitie ?? "",
  },
  actions: {
    start() {
      if (this.contactmomentLoopt) return;
      this.startNieuweVraag();
      this.contactmomentLoopt = true;
    },
    startNieuweVraag() {
      const nieuweVraag: Vraag = {
        zaken: [],
        klanten: this.huidigeVraag ? [...this.huidigeVraag.klanten] : [],
        notitie: "",
        contactverzoek: undefined,
        startdatum: getFormattedUtcDate(),
      };
      this.vragen.push(nieuweVraag);
      this.huidigeVraag = nieuweVraag;
    },
    stop() {
      this.$reset();
      // Temporary. When we implement multiple running contactmomenten, each will have it's own state
      resetAllState();
    },
    addZaak(zaak: Zaak) {
      const contactmomentZaak = zaak as ContactmomentZaak;
      const index = this.zaken.findIndex((element) => element.id === zaak.id);
      if (index === -1) {
        //als de zaak nog niet gekoppeld was aan het contact moment dan voegen we hem eerst toe
        this.zaken.push(contactmomentZaak);
        contactmomentZaak.shouldStore = true;
      } else {
        const existingZaak = this.zaken[index];
        existingZaak.shouldStore = true;
      }
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
      if (!this.huidigeVraag) return;
      this.huidigeVraag.nieuweKlant = undefined;

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
      if (!this.huidigeVraag) return;
      this.huidigeVraag.notitie = notitie;
    },
  },
});
