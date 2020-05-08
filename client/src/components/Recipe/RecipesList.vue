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
                  <th>Löschen</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="item in recipes" :key="item.id">
              <td @click="goToRecipe(item.id)" style="width: 25em; cursor: pointer">{{ item.name }}</td>
              <td>
                <i class="fa fa-trash-o" style="margin-left: 1em" @click="confirm(deleteRecipe, item.id)"></i>
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
    async createRecipe() {
      const recipe = {
        name: 'Rezeptname',
        portions: 4,
        recipecategory_id: 2
      };

      await HTTP.post('/api/recipes', recipe);
      const response = await HTTP.get('api/recipe/max');
      this.goToRecipe(response.data.maxid);
    },
    async deleteRecipe(id) {
      await HTTP.delete(`/api/recipes/${id}`);
      this.getRecipes();
    },
    async getRecipes() {
      const response = await HTTP.get('/api/recipes');
      this.recipes = response.data;
    },
    confirm(func, id) {
      this.$modal.show('dialog', {
        title: 'Bestätigung',
        text: 'Diesen Eintrag wirklich löschen?',
        buttons: [
          { title: 'Ja', handler: () => { func(id); this.$modal.hide('dialog'); } },
          { title: 'Nein' }
        ]
      });
     },
  },
  created() {
    this.getRecipes();
  },
};
</script>
