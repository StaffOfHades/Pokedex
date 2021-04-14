<template>
  <v-app>
    <v-app-bar app color="deep-orange lighten-1" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Pokedex Logo"
          class="shrink mr-2"
          contain
          src="https://cdn6.aptoide.com/imgs/a/6/b/a6b8538c4c6e2fd78e191d9659878e9e_icon.png"
          transition="scale-transition"
          width="40"
          style="cursor: pointer"
          @click="$router.push('/')"
        />

        <v-img
          alt="PokeAPI Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="/img/pokeapi_logo.png"
          width="100"
          style="cursor: pointer"
          @click="$router.push('/')"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn class="mr-4" icon to="profile">
        Perfil
        <v-icon>mdi-account</v-icon>
      </v-btn>

      <v-btn href="https://pokeapi.co/" target="_blank" text>
        <span class="mr-2">API</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters } from 'vuex';

  import { Actions, Getters } from './store/types';

  export default Vue.extend({
    name: 'App',

    data: () => ({
      //
    }),

    computed: {
      ...mapGetters({
        pokemons: Getters.PokemonsLength,
      }),
    },

    mounted() {
      if (this.pokemons === 0) this.$store.dispatch({ type: Actions.LoadInitialData });
    },
  });
</script>
