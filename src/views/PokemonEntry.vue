<template>
  <v-container fluid>
    <v-card v-if="pokemon !== undefined" class="text-center">
      <!-- The pokemon data might not be loaded, so use a placeholder if the sprites are not yet available. -->
      <!-- Additionally, use the default sprite as placeholde to load the official artwork -->
      <v-img
        class="mx-auto"
        max-height="400px"
        max-width="400px"
        :lazy-src="
          pokemon.sprites !== undefined
            ? pokemon.sprites.front_default || '/img/pokemon_placeholder.png'
            : '/img/pokemon_placeholder.png'
        "
        :src="
          pokemon.sprites !== undefined
            ? pokemon.sprites.other['official-artwork'].front_default ||
              pokemon.sprites.front_default ||
              undefined
            : undefined
        "
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-2"></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-title class="justify-center">
        {{ pokemon.name }}
      </v-card-title>

      <v-card-subtitle v-if="pokemon.id !== undefined"> #{{ pokemon.id }} </v-card-subtitle>
      <v-card-subtitle v-else> &nbsp; </v-card-subtitle>

      <div v-if="pokemon.types !== undefined" class="text-center">
        <v-chip v-for="type in pokemon.types" :key="type.slot" class="ma-2" label>
          {{ type.type.name }}
        </v-chip>
      </div>
      <div v-else class="text-center">
        <v-chip class="ma-2" label style="visibility: hidden"> &nbsp; </v-chip>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapState } from 'vuex';

  import { Actions, Getters, NamedAPIResource, Pokemon, State } from '../store/types';

  // Type guard to check if passed pokemon is in fact a pokemon
  function isPokemon(pokemon: NamedAPIResource | Pokemon): pokemon is Pokemon {
    return 'id' in pokemon;
  }

  export default Vue.extend({
    name: 'PokemonEntry',
    data: () => ({ loading: true }),
    computed: {
      id(): number {
        return Number.parseInt(this.$route.params.id, 10);
      },
      pokemon(): NamedAPIResource | Pokemon | undefined {
        return this.pokemons.find(pokemon => {
          if (isPokemon(pokemon)) return pokemon.id === this.id;
          return pokemon.url.includes(`/${this.id}`);
        });
      },
      ...mapState({
        pokemons(state: State): Array<NamedAPIResource | Pokemon> {
          return state.pokemons;
        },
      }),
      ...mapGetters({
        pokemonsLength: Getters.PokemonsLength,
      }),
    },
    watch: {
      pokemonsLength(newLength: number, oldLength: number) {
        if (oldLength === 0 && newLength > 0)
          this.loadPokemonData().then(() => {
            this.loading = false;
          });
      },
    },
    methods: {
      // Sends request to vuex to retrieve data for specified pokemon.
      async loadPokemonData() {
        if (this.pokemon === undefined || isPokemon(this.pokemon)) return;
        this.loading = true;
        await this.$store.dispatch({ url: this.pokemon.url, type: Actions.LoadPokemon });
        this.loading = false;
      },
    },
    mounted() {
      this.loadPokemonData().then(() => {
        this.loading = false;
      });
    },
  });
</script>
