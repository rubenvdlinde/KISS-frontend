<template>
  <article>
    <utrecht-heading model-value :level="level">
      {{ title }}
    </utrecht-heading>
    <div>
      <section>
        <utrecht-heading model-value :level="level + 1"
          >Algemene contactgegevens</utrecht-heading
        >
        <dl>
          <dt>E-mailadres:</dt>
          <dd>{{ jsonObject?.user }}</dd>
          <dt>Telefoonnummer:</dt>
          <dd>{{ jsonObject?.contact?.telefoonnummer1 }}</dd>
        </dl>
      </section>
      <section>
        <utrecht-heading model-value :level="level + 1">Agenda</utrecht-heading>
        <table class="availability">
          <thead>
            <tr>
              <th></th>
              <th
                v-for="(_, day) in jsonObject?.calendar?.availabilities"
                :key="day"
              >
                {{ day }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">ochtend</th>
              <td
                v-for="(value, day) in jsonObject?.calendar?.availabilities"
                :key="day"
                :class="[value.ochtend ? 'groen' : 'rood']"
              >
                {{ value.ochtend ? "beschikbaar" : "niet beschikbaar" }}
              </td>
            </tr>
            <tr>
              <th scope="row">middag</th>
              <td
                v-for="(value, day) in jsonObject?.calendar?.availabilities"
                :key="day"
                :class="[value.middag ? 'groen' : 'rood']"
              >
                {{ value.middag ? "beschikbaar" : "niet beschikbaar" }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    <section>
      <utrecht-heading :level="level + 1" model-value
        >Detailgegevens</utrecht-heading
      >
      <img
        v-if="jsonObject.optionalProfilePicture"
        :src="jsonObject.optionalProfilePicture"
        width="128"
      />
      <dl>
        <dt>Functie:</dt>
        <dd>{{ jsonObject?.function }}</dd>
        <dt>Afdeling:</dt>
        <dd>{{ jsonObject?.department }}</dd>
        <dt>Wat kun je en wat doe je:</dt>
        <dd>{{ jsonObject?.skills }}</dd>
        <template v-if="jsonObject?.replacement?.name">
          <dt>Vervanger:</dt>
          <dd>{{ jsonObject.replacement.name }}</dd>
        </template>
      </dl>
    </section>
  </article>
</template>

<script lang="ts" setup>
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

defineProps<{ jsonObject: any; level: 2 | 3 | 4; title: string }>();
</script>

<style lang="scss" scoped>
article {
  display: grid;
  gap: var(--spacing-default);
  grid-template-columns: 1fr 1fr;
  column-gap: var(--spacing-large);

  > div {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-default);
  }

  > :first-child {
    grid-column: span 2;
  }

  img {
    margin-bottom: var(--spacing-default);
  }

  section > :first-child {
    margin-block-end: var(--spacing-default);
  }
}

.pagination {
  margin-inline: auto;
}

table {
  border-collapse: separate;
  border-spacing: var(--spacing-small);
}
table td {
  font-size: 0;
}
.groen {
  background-color: green;
}
.rood {
  background-color: red;
}

dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: var(--spacing-small);
}

dt {
  font-weight: bold;
}

dd,
dt {
  line-height: normal;
}

h2 {
  margin-bottom: 1em;
}
</style>
