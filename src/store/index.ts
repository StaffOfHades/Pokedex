import Vue from 'vue';
import Vuex, { ActionTree, GetterTree, MutationTree } from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

import {
  Actions,
  Getters,
  Mutations,
  NamedAPIResource,
  NamedAPIResourceList,
  Pokemon,
  State,
} from './types';

Vue.use(Vuex);

// Type guard to check if passed pokemon is in fact a pokemon.
function isPokemon(pokemon: NamedAPIResource | Pokemon): pokemon is Pokemon {
  return 'id' in pokemon;
}

const state = (): State => ({
  pokemons: [],
});

const getters: GetterTree<State, State> = {
  // Return the number of pokemon data that where loaded in full
  [Getters.NumberOfPokemonsLoaded]({ pokemons }): number {
    return pokemons.filter(pokemon => isPokemon(pokemon)).length;
  },
  // Return the lengh of the pokemon array
  [Getters.PokemonsLength]({ pokemons }): number {
    return pokemons.length;
  },
};

const mutations: MutationTree<State> = {
  /* eslint-disable no-param-reassign */
  // Sets the passed pokemon to the specified index of pokemin in local state.
  [Mutations.SetPokemon](localState, { index, pokemon }) {
    Vue.set(localState.pokemons, index, pokemon);
  },
  // Sets the passed pokemons array to the local state.
  [Mutations.SetPokemons](localState, { pokemons }) {
    localState.pokemons = pokemons;
  },
};

const actions: ActionTree<State, State> = {
  // Loads all initial data required for the app to start working.
  async [Actions.LoadInitialData]({ dispatch }) {
    await dispatch({ type: Actions.LoadPokemonsResourceList });
  },
  // Loads a specific pokemon url from server and save it to matching index.
  async [Actions.LoadPokemon]({ commit, state: localState }, { cascade, index: maybeIndex, url }) {
    // Find the pokemon index for the passed url if the pokemon index was not passed.
    const index =
      maybeIndex ??
      localState.pokemons.findIndex(pokemon => {
        // A pokemon does note have an associated url, so skip it.
        if (isPokemon(pokemon)) return false;
        return pokemon.url === url;
      });
    // If the pokemon index does not exit, we cannot load the specified pokemon.
    if (index < 0) return;
    try {
      const { data: pokemon } = await axios.get<Pokemon>(url);
      commit({ index, pokemon, type: Mutations.SetPokemon });
    } catch (error) {
      if (cascade === true) throw error;
      console.log(error);
    }
  },
  // Loads all pokemon data from server for a subset of the pokemon catalog.
  async [Actions.LoadPokemons]({ dispatch, state: localState }, payload) {
    const { pokemons }: { pokemons: Array<NamedAPIResource | Pokemon> } = payload;
    try {
      await Promise.all(
        pokemons.map(pokemon => {
          // A pokemon that has already been loaded does not need to be loaded again..
          if (isPokemon(pokemon)) return Promise.resolve();
          // Dispatch vuex action to load pokemon from server.
          return dispatch({
            cascade: true,
            index: localState.pokemons.findIndex(maybePokemon => maybePokemon === pokemon),
            type: Actions.LoadPokemon,
            url: pokemon.url,
          });
        }),
      );
    } catch (error) {
      console.error(error);
    }
  },
  // Loads all pokemon resource list data from server.
  async [Actions.LoadPokemonsResourceList]({ commit }) {
    try {
      const {
        data: { results: pokemons },
      } = await axios.get<NamedAPIResourceList>('https://pokeapi.co/api/v2/pokemon', {
        params: { limit: 2000 },
      });
      commit({ pokemons, type: Mutations.SetPokemons });
    } catch (error) {
      console.error(error);
    }
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState()],
});
