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
              <v-img
                class="mx-auto"
                height="100px"
                width="100px"
                :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
              />

              <v-card-title class="justify-center">
                {{ pokemon.name }}
              </v-card-title>

              <v-card-subtitle> #{{ pokemon.id }} </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';

  interface NamedAPIResource {
    name: string;
    url: string;
  }

  interface NamedAPIResourceWithID extends NamedAPIResource {
    id: string;
  }

  interface NamedAPIResourceList {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<NamedAPIResource>;
  }

  export default Vue.extend({
    name: 'PokemonCatalog',
    data: () => ({
      currentPage: 0,
      loading: false,
      pokemons: [] as Array<NamedAPIResourceWithID>,
      pokemonsPerPage: 20,
      search: '',
      sortBy: 'name',
    }),
    watch: {
      // If the search term becomes an empty string, make sure we are sorting by name as the default.
      search(newSearch) {
        if (newSearch.trim().length === 0) this.sortBy = 'name';
      },
    },
    methods: {
      // Filter pokemons based of search term, which can either be a pokemon id or a pokemon name.
      filterPokemons(
        items: Array<NamedAPIResourceWithID>,
        search: string,
      ): Array<NamedAPIResourceWithID> {
        // If the search term is not a number, filter by pokemon name.
        if (Number.isNaN(Number.parseInt(search, 10))) {
          this.sortBy = 'name';
          return items.filter(({ name }) => name.includes(search));
        }
        // Otherwise, filter by pokemon name & sort by id instead of name
        this.sortBy = 'id';
        return items.filter(({ id }) => id.toString().includes(search));
      },
      // Retrieve all existing pokemon names & URls from server, using URL to save id for pokemon.
      async loadPokemon() {
        this.loading = true;
        try {
          const {
            data: { results },
          } = await this.$axios.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon', {
            params: { limit: 2000 },
          });
          this.pokemons = results.map(pokemon => {
            const pokemonWithId = pokemon as NamedAPIResourceWithID;
            // The pokemon URL always follows the format: https://pokeapi.co/api/v2/pokemon/1/.
            // Therfore, we can always get the substrig for the pokemon that is its id.
            pokemonWithId.id = pokemon.url.substring(34, pokemon.url.length - 1);
            return pokemonWithId;
          });
        } catch (exception) {
          console.error(exception);
        }
        this.loading = false;
      },
    },
    // Once the vue instance is mounted, load pokemon from server.
    mounted() {
      this.loadPokemon();
    },
  });
</script>
