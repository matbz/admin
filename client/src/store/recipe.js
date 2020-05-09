import Vue from 'vue';
import Vuex from 'vuex';
import { HTTP } from '@/common/utilities';

Vue.use(Vuex);

const SET_RECIPE = 'SET_RECIPE';
const SET_STEPS = 'SET_STEPS';
const SET_INGREDIENTGROUPS = 'SET_INGREDIENTGROUPS';
const SET_INGREDIENTS = 'SET_INGREDIENTS';
const SET_IG = 'SET_IG';
const ADD_TO_REFRESH = 'ADD_TO_REFRESH';

const recipe = {
  namespaced: false,
  state: {
    recipes: {},
    steps: [],
    ingredientGroups: [],
    ingredients: [],
    refresh: 0,
    selectedIG: {}
  },
  mutations: {
    SET_RECIPE(state, data) {
      state.recipes = data;
    },
    SET_STEPS(state, data) {
      state.steps = data;
    },
    SET_INGREDIENTGROUPS(state, data) {
      state.ingredientGroups = data;
    },
    SET_INGREDIENTS(state, data) {
      state.ingredients = data;
    },
    SET_IG(state, data) {
      state.selectedIG = data;
    },
    ADD_TO_REFRESH(state, data) {
      state.refresh++;
    }
  },
  actions: {
    async getRecipe({ commit }, id) {
      try {
        const response = await HTTP.get(`/api/recipes/${id}`);
        commit(SET_RECIPE, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getSteps({ commit }, id) {
      try {
        const response = await HTTP.get(`/api/recipes/${id}/steps`);
        commit(SET_STEPS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getIngredientGroups({ commit }, id) {
      try {
        const response = await HTTP.get(`/api/recipes/${id}/ingredientgroups`);
        commit(SET_INGREDIENTGROUPS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async getIngredients({ commit }, id) {
      try {
        const response = await HTTP.get(`/api/ingredientgroups/${id}/ingredients`);
        commit(SET_INGREDIENTS, response.data);
      } catch (error) {
        throw new Error(error);
      }
    },
    async setIG({ commit }, data) {
      commit(SET_IG, data);
    },
    refresh({ commit }) {
      commit(ADD_TO_REFRESH);
    },
    backup() {
      window.open(process.env.API_URL + `/api/recipes/backup`);
    }
  },
  getters: {
    recipes(state) {
      return state.recipes;
    },
    ingredientGroups(state) {
      return state.ingredientGroups;
    },
    ingredients(state) {
      return state.ingredients;
    },
    steps(state) {
      return state.steps;
    },
    refresh(state) {
      return state.refresh;
    },
    selectedIG(state) {
      return state.selectedIG;
    }
  }
};

export default recipe;
