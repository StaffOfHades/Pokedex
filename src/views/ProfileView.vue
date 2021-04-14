<template>
  <v-container fluid>
    <v-card>
      <v-btn
        class="mb-4 d-inline-flex d-sm-none d-md-none d-lg-none d-xl-none"
        color="grey darken-2"
        dark
        style="left: 16px; top: 16px"
        to="/"
      >
        <v-icon dark left> mdi-arrow-left </v-icon>Back
      </v-btn>
      <v-btn
        absolute
        class="d-none d-sm-inline-flex d-md-inline-flex d-lg-inline-flex d-xl-inline-flex"
        color="grey darken-2"
        dark
        left
        to="/"
        top
      >
        <v-icon dark left> mdi-arrow-left </v-icon>Back
      </v-btn>

      <v-img
        class="mx-auto"
        max-height="400px"
        max-width="400px"
        src="/img/profile_placeholder.jpg"
      >
      </v-img>

      <v-card-title class="justify-center">
        <span class="reverse"> {{ name }} </span>
      </v-card-title>

      <v-card-subtitle class="text-center">
        <span class="reverse ml-4"> {{ phone }} </span>
        <a
          class="cryptedmail reverse"
          :data-name="dataset.name"
          :data-domain="dataset.domain"
          :data-tld="dataset.tld"
          @click="openEmail"
        ></a>
      </v-card-subtitle>

      <v-card-text class="text-center">
        <p class="reverse">{{ birthdate }}</p>
        <p>
          <v-icon left> mdi-gender-male </v-icon>
          Hombre
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'ProfileView',
    data: () => ({
      birthdate: '4991 ed erbmeiciD ed 41',
      dataset: {
        domain: 'sirefni',
        name: 'zaonaicarg.oiciruam',
        tld: 'hcet',
      },
      name: 'zeravlA onaicarG oiciruaM',
      phone: '(64 51 59 34 55)',
    }),
    methods: {
      openEmail() {
        const email = `${this.dataset.tld}.${this.dataset.domain}@${this.dataset.name}`
          .split('')
          .reverse()
          .join('');
        window.location.href = `mailto:${email}`;
      },
    },
  });
</script>

<style scoped>
  .cryptedmail:after {
    content: attr(data-tld) '.' attr(data-domain) '@' attr(data-name);
  }
  .reverse {
    unicode-bidi: bidi-override;
    direction: rtl;
  }
</style>
