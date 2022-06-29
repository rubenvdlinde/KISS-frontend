import type { Zaak } from "@/features/zaaksysteem/types";
import { defineStore } from "pinia";

export type ContactmomentZaak = Zaak & { shouldStore: boolean };

export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    return {
      contactmomentLoopt: false,
      // zaken: <Zaak[]>[],
      zaken: <ContactmomentZaak[]>[],
    };
  },
  actions: {
    start() {
      this.contactmomentLoopt = true;
    },
    stop() {
      this.contactmomentLoopt = false;
    },
    toggleZaak(zaak: Zaak) {
      const contactmomentZaak = zaak as ContactmomentZaak;
      if (this.zaken.findIndex((element) => element.id === zaak.id) === -1) {
        //als de zaak nog niet gekoppeld was aan het contact moment dan voegen we hem eerst toe
        this.zaken.push(contactmomentZaak);
      }

      //toggle of hij wel niet opgeslagen moet worden bij het contactmoment
      contactmomentZaak.shouldStore = !contactmomentZaak.shouldStore;
    },
    findById(id: string) {
      return this.zaken.find((element) => element.id === id);
    },
  },
});
