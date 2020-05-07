<template>
  <div class="ynab-u">
    <div class="header"></div>
    <div class="content">
      <div class="pure-g add-list">
        <div style="width: 100%; height: 100%">
          <div class="turnover-group">
            <button title="Neues Rezept anlegen" class="button" @click="createRecipe()">Neues Rezept anlegen</button>
          </div>
        </div>
      </div>

      <table class="pure-table theader igt rt">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>Aktionen</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="item in recipes" :key="item.id">
              <td style="width: 25em">{{ item.name }}</td>
              <td>
                <i class="fa fa-pencil-square-o" @click="goToRecipe(item.id)" style="margin-right: 1em"></i>
                <i class="fa fa-trash-o" @click="deleteRecipe(item.id)"></i>
              </td>
            </tr>
           </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import RecipesListItem from './RecipesListItem';

export default {
  components: {
    RecipesListItem
  },
  props: [
  ],
  data() {
    return {
      recipes: {}
    };
  },
  computed: {
    ...mapGetters([

    ])
  },
  methods: {
    goToRecipe(id) {
      this.$router.push({ name: 'recipe', params: { id: id } });
    },
    createRecipe() {

    },
    deleteRecipe(id) {

    }
  },
  async created() {
    const response = await HTTP.get('/api/recipes');
    this.recipes = response.data;
  },
};
</script>
