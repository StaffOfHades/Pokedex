<template>
  <v-container fluid>
    <v-data-iterator
      :custom-filter="filterPokemons"
      :items="pokemons"
      :items-per-page.sync="pokemonsPerPage"
      :footer-props="{
        'items-per-page-options': [20],
        'show-current-page': true,
        'show-first-last-page': true,
      }"
      :loading="loading"
      :page.sync="currentPage"
      :search="search"
      :sort-by.sync="sortBy"
      @current-items="loadPokemonData"
    >
      <template v-slot:header>
        <v-text-field
          v-model="search"
          label="Buscar Pokemon"
          class="mx-4"
          placeholder="Buscar por nombre o id"
        />
      </template>

      <template v-slot:default="{ items: pokemons }">
        <v-row>
          <v-col v-for="pokemon in pokemons" :key="pokemon.name" cols="12" sm="6" md="4" lg="3">
            <v-card class="text-center">
              <!-- The pokemon data might not be loaded, so use a placeholder if the sprites are not yet available. -->
              <!-- Additionally, use the default sprite as placeholde to load the official artwork -->
              <v-img
                class="mx-auto"
                height="400px"
                width="400px"
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
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>

              <v-card-title class="justify-center">
                {{ pokemon.name }}
              </v-card-title>

              <v-card-subtitle v-if="pokemon.id !== undefined"> #{{ pokemon.id }} </v-card-subtitle>
              <v-card-subtitle v-else> &nbsp; </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapState } from 'vuex';

  import { Actions, NamedAPIResource, Pokemon, State } from '../store/types';

  // Type guard to check if passed pokemon is in fact a pokemon
  function isPokemon(pokemon: NamedAPIResource | Pokemon): pokemon is Pokemon {
    return 'id' in pokemon;
  }

  export default Vue.extend({
    name: 'PokemonCatalog',
    data: () => ({
      currentPage: 1,
      loading: false,
      pokemonsPerPage: 20,
      search: '',
      sortBy: 'name',
    }),
    computed: {
      ...mapState({
        pokemons(state: State): Array<NamedAPIResource | Pokemon> {
          return state.pokemons;
        },
      }),
    },
    watch: {
      // If the search term becomes an empty string, make sure we are sorting by name as the default.
      search(newSearch) {
        if (newSearch.trim().length === 0) this.sortBy = 'name';
      },
    },
    methods: {
      // Filter pokemons based of search term, which can either be a pokemon id or a pokemon name.
      filterPokemons(
        pokemons: Array<NamedAPIResource | Pokemon>,
        search: string,
      ): Array<NamedAPIResource | Pokemon> {
        // Only search if valid term was passed.
        if (search.trim().length === 0) return pokemons;

        // If the search term is not a number, filter by pokemon name.
        if (Number.isNaN(Number.parseInt(search, 10))) {
          this.sortBy = 'name';
          return pokemons.filter(pokemon => pokemon.name.includes(search));
        }
        // Otherwise, filter by pokemon name & sort by id instead of name
        this.sortBy = pokemons.find(pokemon => isPokemon(pokemon)) !== undefined ? 'id' : 'name';
        return pokemons.filter(pokemon =>
          isPokemon(pokemon)
            ? pokemon.id.toString().includes(search)
            : pokemon.url.includes(search),
        );
      },
      // Sends request to vuex to retrieve data for specified pokemon.
      async loadPokemonData(pokemons: Array<NamedAPIResource | Pokemon>) {
        this.loading = true;
        await this.$store.dispatch({ pokemons, type: Actions.LoadPokemons });
        console.log('pokemons updated');
        this.loading = false;
      },
    },
  });
</script>
