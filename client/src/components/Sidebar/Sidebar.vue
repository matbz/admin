<template>
   <nav class="ynab-u sidebar">
      <div class="sidebar-contents">
        <button class="button button-prefs">
            Administration
        </button>
        <ul class="nav-main">
          <router-link :to="{ name: 'recipes' }" tag="li">
            <a>
              <i class=" fa fa-clone"></i>
              Rezepte
            </a>
          </router-link>
          <!-- <router-link :to="{ name: 'tags' }" tag="li" exact>
            <a>
              <i class=" fa fa-tags"></i>
              Tags
            </a>
          </router-link> -->
        </ul>
      </div>
      <button class="button-prefs button-prefs-user button">
         <div @click="logout()" class="button-truncate" style="cursor: pointer; float: left">
            <i class="fa fa-sign-out flaticon"></i>
         </div>
         <div @click="showSettings()" class="button-truncate" style="cursor: pointer; float: right">
            <i class="fa fa-cog flaticon"></i>
         </div>
      </button>

      <modal-add-account></modal-add-account>
      <modal-settings></modal-settings>
   </nav>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import moment from 'moment';
import ModalAddAccount from './ModalAddAccount';
import ModalSettings from './ModalSettings';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default {
  components: {
    ModalAddAccount,
    ModalSettings
  },
  computed: {
    ...mapGetters([
      'user',
      'budgetDate'
    ]),
    budgetRouteDate() {
      return moment(this.budgetDate).format('YYYYMM');
    },
    matchedRoute() {
      if (this.$route.matched[0]) {
        return this.$route.matched.length && this.$route.matched[0].name;
      }
    }
  },
  methods: {
    goToBudget() {
      this.$router.push({ name: 'budget_date', params: { date: this.budgetRouteDate } });
    },
    goToRecentBudget() {
      this.$router.push({ name: 'budget' });
    },
    addAccount() {
      this.$modal.show('add-account-modal');
    },
    showSettings() {
      this.$modal.show('modal-settings');
    },
    async switchBudget() {
      const response = await HTTP.get(`/api/budgets?userid=${this.user.id}`);
      if (response.data.length === 2) {
        await asyncForEach(response.data, async (o) => {
          await HTTP.put(`/api/budgets/${o.id}`, {
            active: !o.active
          });
        });

        await this.$store.dispatch('getBudgetId', this.$store.getters.user);
        this.$store.dispatch('getAccounts');
        this.$store.dispatch('getToBeBudgeted', this.budgetDate);
        this.$store.dispatch('getBudgetedLastMonth', this.budgetDate);
        this.$store.dispatch('getBudgetList', this.budgetDate);
        this.$router.push({ name: 'budget' });
      } else {
        this.$toasted.show('No other budget found.');
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
</script>


