import type { Klant } from "@/features/klant/types";
import type { Zaak } from "@/features/zaaksysteem/types";
import { getFormattedUtcDate } from "@/services";
import { defineStore } from "pinia";
import { resetAllState } from "../create-store";
export * from "./types";

export type ContactmomentZaak = { zaak: Zaak; shouldStore: boolean };

interface Vraag {
  zaken: ContactmomentZaak[];
  notitie: string;
  contactverzoek: { url: string; medewerker: string } | undefined;
  startdatum: string;
  klanten: { klant: Klant; shouldStore: boolean }[];
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
    klant(state): Klant | undefined {
      return state.huidigeVraag?.klanten
        ?.filter((x) => x.shouldStore)
        ?.map((x) => x.klant)?.[0];
    },
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
        notitie: "",
        contactverzoek: undefined,
        startdatum: getFormattedUtcDate(),
        klanten: this.huidigeVraag?.klanten
          ? this.huidigeVraag.klanten.map((klantKoppeling) => ({
              ...klantKoppeling,
            }))
          : [],
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
      if (!this.huidigeVraag) return;

      const match = this.huidigeVraag.zaken.find(
        (element) => element.zaak.id === zaak.id
      );

      if (match) {
        match.zaak = zaak;
        match.shouldStore = true;
        return;
      }

      //als de zaak nog niet gekoppeld was aan het contact moment dan voegen we hem eerst toe
      this.huidigeVraag.zaken.push({
        zaak,
        shouldStore: true,
      });
    },
    toggleZaak(zaak: Zaak) {
      if (!this.huidigeVraag) return false;

      const match = this.huidigeVraag.zaken.find(
        (element) => element.zaak.id === zaak.id
      );

      if (match) {
        match.zaak = zaak;
        match.shouldStore = !match.shouldStore;
        return;
      }

      this.huidigeVraag.zaken.push({
        zaak,
        shouldStore: true,
      });
    },
    isZaakLinkedToContactmoment(id: string) {
      return (
        this.huidigeVraag?.zaken?.some(
          ({ zaak, shouldStore }) => shouldStore && zaak.id === id
        ) ?? false
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
    setNotitie(notitie: string) {
      if (!this.huidigeVraag) return;
      this.huidigeVraag.notitie = notitie;
    },
  },
});
