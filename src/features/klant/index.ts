export * from "./service";
export * from "./types";

export { default as PersoonDetails } from "./persoon/PersoonDetails.vue";
export { default as PersoonZoeker } from "./persoon/PersoonZoeker.vue";
export { default as BrpGegevens } from "./persoon/BrpGegevens.vue";

export { default as BedrijfDetails } from "./bedrijf/BedrijfDetails.vue";
export { default as BedrijfZoeker } from "./bedrijf/BedrijfZoeker.vue";
export { default as HandelsregisterGegevens } from "./bedrijf/HandelsregisterGegevens.vue";

export { usePersoonByBsn } from "./persoon/service";
export { useBedrijfByVestigingsnummer } from "./bedrijf/service";
