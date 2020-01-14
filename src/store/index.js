import Vue from 'vue';
import Vuex from 'vuex';
import category from '../assets/data/category';
import city from '../assets/data/city';
import data from '../assets/data/data';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: category,
    cities: city,
    defaultList: data,
    filtersParams: null,
  },
  mutations: {
    setNewFiltersParams(state, payload) {
      state.filtersParams = { ...payload };
    },
  },
  actions: {
    sendFilters(context, payload) {
      context.commit('setNewFiltersParams', payload);
    },
  },
  getters: {
    // Получить имя категории по id
    getCategoryName: state => id => state.categories.find(elem => elem.id === id).name,
    // Получить имя города по id
    getCityName: state => id => state.cities.find(elem => elem.id === id).name,
    // Получить количество постов в каждой категории
    getItemsInCategory: (state, getters) => id => getters.getSelectedList.filter(elem => elem.category === id).length,
    // Получить минимальное значение шкалы
    getMinRange: state => state.defaultList.reduce((acc, elem) => (acc < elem.price ? acc : elem.price), +Infinity),
    // Получить максимальное значение шкалы
    getMaxRange: state => state.defaultList.reduce((acc, elem) => (acc > elem.price ? acc : elem.price), -Infinity),
    // это очень большой и плохо читаемый кусок кода и мне за него стыдно(
    getSelectedList: (state) => {
      if (!state.filtersParams) {
        return state.defaultList;
      }
      let filteredData = [];
      if (state.filtersParams.currentCity) {
        filteredData = state.defaultList.filter(elem => elem.city === state.filtersParams.currentCity);
        if (!filteredData.length) {
          return [];
        }
      }
      if (state.filtersParams.minRange) {
        if (filteredData.length) {
          filteredData = filteredData.filter(elem => elem.price >= state.filtersParams.minRange);
          if (!filteredData.length) {
            return [];
          }
        } else {
          filteredData = state.defaultList.filter(elem => elem.price >= state.filtersParams.minRange);
        }
      }
      if (state.filtersParams.maxRange) {
        if (filteredData.length) {
          filteredData = filteredData.filter(elem => elem.price <= state.filtersParams.maxRange);
          if (!filteredData.length) {
            return [];
          }
        } else {
          filteredData = state.defaultList.filter(elem => elem.price <= state.filtersParams.maxRange);
        }
      }
      if (state.filtersParams.selectedCategories.length) {
        const tempArray = [];
        state.filtersParams.selectedCategories.forEach((elem) => {
          if (filteredData.length) {
            tempArray.push(...filteredData.filter(innerElem => innerElem.category === elem));
          } else {
            tempArray.push(...state.defaultList.filter(innerElem => innerElem.category === elem));
          }
        });
        filteredData = tempArray;
      }
      return filteredData;
    },
  },
  modules: {},
});
