import type { Klant } from "@/features/klant/types";
import type {
  Medewerker,
  Website,
  Storable,
  Kennisartikel,
  Nieuwsbericht,
  Werkinstructie,
} from "@/features/search/types";
import type { Zaak } from "@/features/zaaksysteem/types";
import { defineStore } from "pinia";
import { resetAllState } from "../create-store";
import type { NieuweKlant } from "./types";
export * from "./types";

export type ContactmomentZaak = Zaak & Storable;

interface ContactmomentState {
  contactmomentLoopt: boolean;
  zaken: ContactmomentZaak[];
  klanten: { klant: Klant; shouldStore: boolean }[];
  notitie: string;
  contactverzoek: { url: string; medewerker: string } | undefined;
  nieuweKlant: NieuweKlant | undefined;
  startdatum: string;
  medewerkers: (Medewerker & Storable)[];
  websites: (Website & Storable)[];
  kennisartikelen: (Kennisartikel & Storable)[];
  nieuwsberichten: (Nieuwsbericht & Storable)[];
  werkinstructies: (Werkinstructie & Storable)[];
}

export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    return {
      contactmomentLoopt: false,
      zaken: <ContactmomentZaak[]>[],
      klanten: [],
      notitie: "",
      contactverzoek: undefined,
      nieuweKlant: undefined,
      startdatum: "",
      medewerkers: [],
      websites: [],
      kennisartikelen: [],
      nieuwsberichten: [],
      werkinstructies: [],
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
      this.nieuweKlant = undefined;

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

    addMedewerker(medewerker: any) {
      if (this.medewerkers.find((m) => m.id === medewerker.id)) return;

      this.medewerkers.forEach((m) => {
        m.shouldStore = false;
      });

      this.medewerkers.push({
        id: medewerker.id,
        voornaam: medewerker.contact.voornaam,
        voorvoegselAchternaam: medewerker.contact.voorvoegselAchternaam,
        achternaam: medewerker.contact.achternaam,
        emailadres: medewerker.contact.emailadres,
        shouldStore: true,
      });
    },

    addKennisartikel(kennisartikel: any) {
      if (this.kennisartikelen.find((k) => k.id === kennisartikel.uuid)) return;

      this.kennisartikelen.forEach((k) => {
        k.shouldStore = false;
      });

      this.kennisartikelen.push({
        title:
          kennisartikel?.vertalingen[0]?.productTitelDecentraal ??
          "Onbekende titel",
        id: kennisartikel.uuid,
        shouldStore: true,
      });
    },

    addWebsite(website: Website) {
      if (this.websites.find((w) => w.url === website.url)) return;

      this.websites.forEach((w) => {
        w.shouldStore = false;
      });

      this.websites.push({ ...website, shouldStore: true });
    },

    toggleNieuwsbericht(nieuwsbericht: Nieuwsbericht) {
      const foundBerichtIndex = this.nieuwsberichten.findIndex(
        (n) => n.id === nieuwsbericht.id
      );

      if (foundBerichtIndex !== -1) {
        this.nieuwsberichten.splice(foundBerichtIndex, 1);
        return;
      }

      this.nieuwsberichten.push({ ...nieuwsbericht, shouldStore: true });
    },

    toggleWerkinstructie(werkinstructie: Werkinstructie) {
      const foundWerkinstructieIndex = this.werkinstructies.findIndex(
        (k) => k.id === werkinstructie.id
      );

      if (foundWerkinstructieIndex !== -1) {
        this.werkinstructies.splice(foundWerkinstructieIndex, 1);
        return;
      }

      this.werkinstructies.push({ ...werkinstructie, shouldStore: true });
    },
  },
});
