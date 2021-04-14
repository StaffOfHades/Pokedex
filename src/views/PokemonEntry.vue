<template>
  <v-container fluid>
    <v-card v-if="pokemon !== undefined">
      <v-btn
        class="mb-4 d-inline-flex d-sm-none d-md-none d-lg-none d-xl-none"
        color="grey darken-2"
        dark
        href="/"
        style="left: 16px; top: 16px"
      >
        <v-icon dark left> mdi-arrow-left </v-icon>Back
      </v-btn>
      <v-btn
        absolute
        class="d-none d-sm-inline-flex d-md-inline-flex d-lg-inline-flex d-xl-inline-flex"
        color="grey darken-2"
        dark
        href="/"
        left
        top
      >
        <v-icon dark left> mdi-arrow-left </v-icon>Back
      </v-btn>

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

      <v-card-subtitle v-if="pokemon.id !== undefined" class="text-center">
        #{{ pokemon.id }}
      </v-card-subtitle>
      <v-card-subtitle v-else class="text-center"> &nbsp; </v-card-subtitle>

      <v-card-text v-if="pokemon.types !== undefined" class="text-center">
        <v-chip v-for="type in pokemon.types" :key="type.slot" class="ma-2" label>
          {{ type.type.name }}
        </v-chip>
      </v-card-text>
      <v-card-text v-else class="text-center">
        <v-chip class="ma-2" label style="visibility: hidden"> &nbsp; </v-chip>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title class="justify-center"> estadísticas </v-card-title>
      <v-card-subtitle class="text-center">
        valor máximo nivel 1 - valor mínimo nivel 100
      </v-card-subtitle>

      <v-card-text v-for="stat in stats" :key="stat.stat.name" class="text-center">
        <label class="v-label theme--light mb-12 mb-sm-12 mb-md-0 mb-lg-0 mb-xl-0 d-block">{{
          stat.stat.name
        }}</label>
        <v-range-slider
          thumb-label="always"
          readonly
          :min="stat.rangeMinLevel[0]"
          :max="stat.rangeMaxLevel[1]"
          :value="[stat.rangeMinLevel[1], stat.rangeMaxLevel[0]]"
        >
          <template v-slot:prepend>
            {{ stat.rangeMinLevel[0] }}
          </template>
          <template v-slot:append>
            {{ stat.rangeMaxLevel[1] }}
          </template>
        </v-range-slider>
      </v-card-text>
    </v-card>
    <v-card v-else class="text-center">
      <v-img
        class="mx-auto"
        max-height="400px"
        max-width="400px"
        src="/img/pokemon_placeholder.png
        "
      >
      </v-img>

      <v-card-title class="justify-center"> este pokemon no existe </v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { mapGetters, mapState } from 'vuex';

  import { Actions, Getters, NamedAPIResource, Pokemon, State } from '../store/types';

  interface CalculateHPConfig {
    base: number;
    effort: number;
    individual: number;
    level: number;
  }

  interface CalculateStatConfig extends CalculateHPConfig {
    nature: number;
  }

  interface PokemonStatRange {
    rangeMinLevel: [number, number];
    rangeMaxLevel: [number, number];
    stat: NamedAPIResource; // Stat
  }

  // Type guard to check if passed pokemon is in fact a pokemon
  function isPokemon(pokemon: NamedAPIResource | Pokemon): pokemon is Pokemon {
    return 'id' in pokemon;
  }

  export default Vue.extend({
    name: 'PokemonEntry',
    data: () => ({ loading: true }),
    computed: {
      // Convert the route params id to number & expose
      id(): number {
        return Number.parseInt(this.$route.params.id, 10);
      },
      // Attempt to find the pokemon data matching the passed id
      pokemon(): NamedAPIResource | Pokemon | undefined {
        return this.pokemons.find(pokemon => {
          // Compare to find pokemon using appropiate function depending on type
          if (isPokemon(pokemon)) return pokemon.id === this.id;
          return pokemon.url.includes(`/${this.id}`);
        });
      },
      // Calculate pokemon state ranges from existing stats
      stats(): Array<PokemonStatRange> {
        // Only try to calculate state for a pokemon that exists & has defined stats.
        if (this.pokemon === undefined || !isPokemon(this.pokemon)) return [];
        return this.pokemon.stats.map(({ base_stat: base, effort, stat }) => {
          let maxStatMaxLevel = 0;
          let maxStatMinLevel = 0;
          let minStatMaxLevel = 0;
          let minStatMinLevel = 0;
          // If stat is HP, calculate with differnet formula
          if (stat.name === 'hp') {
            maxStatMaxLevel = this.calculateHp({ base, effort: 255, individual: 15, level: 100 });
            maxStatMinLevel = this.calculateHp({ base, effort: 255, individual: 15, level: 1 });
            minStatMaxLevel = this.calculateHp({ base, effort, individual: 0, level: 100 });
            minStatMinLevel = this.calculateHp({ base, effort, individual: 0, level: 1 });
          } else {
            maxStatMaxLevel = this.calculateStat({
              base,
              effort: 255,
              individual: 15,
              level: 100,
              nature: 1.1,
            });
            maxStatMinLevel = this.calculateStat({
              base,
              effort: 255,
              individual: 15,
              level: 1,
              nature: 1.1,
            });
            minStatMaxLevel = this.calculateStat({
              base,
              effort,
              individual: 0,
              level: 100,
              nature: 0.9,
            });
            minStatMinLevel = this.calculateStat({
              base,
              effort,
              individual: 0,
              level: 1,
              nature: 0.9,
            });
          }
          return {
            rangeMinLevel: [minStatMinLevel, maxStatMinLevel],
            rangeMaxLevel: [minStatMaxLevel, maxStatMaxLevel],
            stat,
          };
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
      // Watch pokemons length to try to load the pokemon data
      // if pokemons catalog was intialized after this view was first loaded.
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
      // Calculate HP using formula for gen 3 & up
      calculateHp({ base, effort, individual, level }: CalculateHPConfig) {
        return (
          Math.floor(((2 * base + individual + Math.floor(effort / 4)) * level) / 100) + level + 10
        );
      },
      // Calculate Stats (apart from HP) using formula for gen 3 & up.
      calculateStat({ base, effort, individual, level, nature }: CalculateStatConfig) {
        return Math.floor(
          (Math.floor(((2 * base + individual + Math.floor(effort / 4)) * level) / 100) + 5) *
            nature,
        );
      },
    },
    // Try to load the pokemon data on start.
    mounted() {
      this.loadPokemonData().then(() => {
        this.loading = false;
      });
    },
  });
</script>
