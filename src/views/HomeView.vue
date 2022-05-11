<template>
  <h1>Startscherm</h1>
  <section>
    <h2>Werkinstructies</h2>
    <ul>
      <li
        v-for="({ title, date, content }, i) in werkInstructies"
        :key="`werkinstructies_${i}`"
      >
        <article>
          <h3>{{ title }}</h3>
          <time :datetime="date.toISOString()" pubdate>{{
            localeString(date)
          }}</time>
          <p>
            {{ content }}
          </p>
        </article>
      </li>
    </ul>
  </section>
  <section>
    <h2>Nieuws</h2>
    <ul>
      <li
        v-for="({ title, date, content }, i) in nieuwsBerichten"
        :key="`nieuws_${i}`"
      >
        <article>
          <h3>{{ title }}</h3>
          <time :datetime="date.toISOString()" pubdate>{{
            localeString(date)
          }}</time>
          <p>
            {{ content }}
          </p>
        </article>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type WerkBericht from "@/types/werk-bericht";
import { ref } from "vue";

const localeString = (d: Date) =>
  d.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const werkInstructies = ref<WerkBericht[]>([
  {
    title: "Mondkapjes",
    date: new Date(2022, 1, 2, 12),
    content:
      "Draag een mondkapje op de werkvloer bij verplaatsing door het gebouw en daar waar geen 1,5 meter afstand kan worden gehouden. Bijvoorbeeld als je naar een vergaderkamer gaat, of alf je koffie gaat halen.",
  },
  {
    title: "Let op Whatsapp",
    date: new Date(2022, 1, 1, 12),
    content:
      "Let vandaag goed op tijdige beantwoording van de Whatsapp-berichten. We krijgen steeds meer meldingen van burgers die meer dan 10 minuten moeten wachten op antwoord. We can do this! Groet, Marc",
  },
]);

const nieuwsBerichten = ref<WerkBericht[]>([
  {
    title: "Daphne Jubilaris",
    date: new Date(2022, 1, 2, 12),
    content:
      "Daphne werkt vandaag alweer 10 jaar bij het KCC team. Gefeliciteerd met het jubileum! Er staat taart bij de koffieautomaat.",
  },
  {
    title: "Aanpak wateroverlast",
    date: new Date(2022, 1, 1, 12),
    content:
      "In de week van maandag 30 mei gaat Weg- en Waterbouw aan de slag in de Voorstraat, om de oorzaak van de wateroverlast te verhelpen. Er zijn bewonersbrieven rondgestuurd, die staan ook op onze website.",
  },
]);
</script>

<style scoped lang="scss">
main > section {
  max-width: var(--section-width);

  h2 {
    padding-left: var(--text-margin);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-tertiary);
    margin-bottom: var(--spacing-default);
  }
}

section ul {
  display: flex;
  flex-flow: column wrap;
  gap: 1.625rem;
}

li > article {
  border-radius: 1rem;
  background-color: var(--color-secondary);
  padding: 0.75rem var(--text-margin);

  > time {
    color: var(--color-primary);
    display: block;
    margin-top: var(--spacing-default);
  }

  p {
    margin-top: 1.25rem;
  }
}
</style>
