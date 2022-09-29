<template>
  <div class="container">
    <div class="header">
      <span>Datum</span>
      <span>Status</span>
      <span>Behandelaar</span>
      <span>Afgerond</span>
      <span class="chevron"></span>
    </div>

    <div
      v-for="(contactverzoek, idx) in contactverzoeken"
      :key="idx"
      class="verzoek-item"
    >
      <button
        @click="toggleItemContent(idx)"
        class="verzoek-item-header"
        :class="{ 'is-active': activeContactverzoeken[idx] }"
      >
        <span>{{ contactverzoek.datum }}</span>
        <span>{{ contactverzoek.status }}</span>
        <span>{{ contactverzoek.behandelaar }}</span>
        <span>{{ contactverzoek.afgerond }}</span>
        <span class="chevron icon-after chevron-down"></span>
      </button>

      <div
        class="verzoek-item-content"
        :class="{ 'is-active': activeContactverzoeken[idx] }"
      >
        <dl>
          <dt>Starttijd</dt>
          <dd>{{ contactverzoek.starttijd }}</dd>
        </dl>

        <dl>
          <dt>Zaaknummer</dt>
          <dd>{{ contactverzoek.zaaknummer }}</dd>
        </dl>

        <dl>
          <dt>Zaaktype</dt>
          <dd>{{ contactverzoek.zaaktype }}</dd>
        </dl>

        <dl>
          <dt>Aanmaker</dt>
          <dd>{{ contactverzoek.aanmaker }}</dd>
        </dl>

        <dl>
          <dt>Status</dt>
          <dd>{{ contactverzoek.status }}</dd>
        </dl>

        <dl>
          <dt>Vraag</dt>
          <dd>{{ contactverzoek.vraag }}</dd>
        </dl>

        <dl>
          <dt>Notitie</dt>
          <dd>
            {{ contactverzoek.notitie }}
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const contactverzoeken = ref([
  {
    id: "abc",
    datum: "30-06-2022",
    status: "Open",
    behandelaar: "Setfan Buijs",
    afgerond: "Nee",
    starttijd: "16:31",
    zaaknummer: "ZAAK-2",
    zaaktype: "Toeslagen",
    aanmaker: "Joost Baas",
    vraag: "Heb ik recht op energietoeslag?",
    notitie:
      "Cras mattis consectetur purus sit amet fermentum. Maecenas faucibus mollis interdum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
]);

const activeContactverzoeken = ref(contactverzoeken.value.map((_) => false));

const toggleItemContent = (idx: number) => {
  activeContactverzoeken.value[idx] = !activeContactverzoeken.value[idx];
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  font-weight: bold;
  background-color: var(--color-tertiary);
  color: var(--color-white);
}

.header > *,
.verzoek-item-header > * {
  flex: 1;
  max-width: 250px;
  padding: var(--spacing-default);
}

.verzoek-item-header {
  all: unset;
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--color-tertiary);

  &.is-active {
    background-color: var(--color-secondary);

    .chevron {
      transform: rotate(180deg);
    }
  }

  &:hover {
    cursor: pointer;
    background-color: var(--color-secondary);
  }
}

.verzoek-item-content {
  background-color: var(--color-secondary);
  dl {
    display: flex;
    padding: var(--spacing-default);
  }

  dl > * {
    flex: 1;
  }

  dl > dt {
    max-width: 150px;
  }

  &:not(.is-active) {
    display: none;
  }
}

.chevron {
  display: flex;
  max-width: 50px;
  align-items: center;
  margin-inline-start: auto;
  transition: transform 250ms;
}
</style>
