import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/user';
import budget from '@/store/budget';
import category from '@/store/category';
import goal from '@/store/goal';
import account from '@/store/account';
import turnover from '@/store/turnover';
import recipe from '@/store/recipe';


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    budget,
    category,
    goal,
    account,
    turnover,
    recipe
  }
});

export default store;
