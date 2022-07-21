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
      this.zaken = [];
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
    findById(id: string) {
      return this.zaken.find((element) => element.id === id);
    },
  },
});
