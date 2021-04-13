/* eslint-disable camelcase */
import { Store as BaseStore } from 'vuex';

// Level 0 (No dependency)

export enum Actions {
  LoadInitialData = 'loadInitialData',
  LoadPokemon = 'loadPokemon',
  LoadPokemons = 'loadPokemons',
  LoadPokemonsResourceList = 'loadPokemonsResourceList',
}

export enum Getters {}

export enum Mutations {
  SetPokemon = 'setPokemon',
  SetPokemons = 'setPokemons',
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other: {
    dream_world: {
      front_default: string | null;
      front_female: string | null;
    };
    'official-artwork': {
      front_default: string | null;
    };
  };
}

// Level 1 (Dependency from level 0)

export interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource; // Generation
}

export interface Name {
  name: string;
  language: NamedAPIResource; // Language
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<NamedAPIResource>;
}

export interface PokemonAbility {
  ability: Array<NamedAPIResource>; // Ability
  is_hidden: boolean;
  slot: number;
}

export interface PokemonHeldItemVersion {
  rarity: number;
  version: NamedAPIResource; // Version
}

export interface PokemonMoveVersion {
  level_learned_at: number;
  move_learn_method: NamedAPIResource; // MoveLearnMethod
  version_group: NamedAPIResource; // VersionGroup
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource; // Stat
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource; // Type
}

export interface TypePokemon {
  slot: number;
  pokemon: NamedAPIResource; // Pokemon
}

export interface TypeRelations {
  double_damage_to: NamedAPIResource; // Type
  double_damage_from: NamedAPIResource; // Type
  half_damage_from: NamedAPIResource; // Type
  half_damage_to: NamedAPIResource; // Type
  no_damage_from: NamedAPIResource; // Type
  no_damage_to: NamedAPIResource; // Type
}

export interface VersionGameIndex {
  game_index: number;
  version: NamedAPIResource; // Version
}

// Level 2 (Dependency from level 1)

export interface PokemonHeldItem {
  item: NamedAPIResource; // Item
  version_details: Array<PokemonHeldItemVersion>;
}

export interface PokemonMove {
  move: NamedAPIResource; // Move
  version_group_details: PokemonMoveVersion;
}

export interface Type {
  damage_relations: number;
  game_indices: Array<GenerationGameIndex>;
  generation: NamedAPIResource; // Generation
  id: number;
  name: string;
  names: Array<Name>;
  move_damage_class: NamedAPIResource; // MoveDamageClass
  moves: Array<NamedAPIResource>; // Move
  pokemon: Array<TypePokemon>;
}

// Level 3 (Dependency from level 2)

export interface Pokemon {
  abilities: Array<PokemonAbility>;
  base_experience: number;
  forms: Array<NamedAPIResource>; // PokemonForm
  game_indices: Array<VersionGameIndex>;
  height: number;
  held_items: Array<PokemonHeldItem>;
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: Array<PokemonMove>;
  name: string;
  order: number;
  species: NamedAPIResource; // PokemonSpecies
  sprites: PokemonSprites;
  stats: Array<PokemonStat>;
  types: Array<PokemonType>;
  weight: number;
}

// Level 4 (Dependency from level 3)

export interface State {
  pokemons: Array<NamedAPIResource | Pokemon>;
}

// Level 5 (Dependency from level 4)

export type Store = BaseStore<State>;
