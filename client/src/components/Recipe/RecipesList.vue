<template>
  <div class="ynab-u">
    <div class="header"></div>
    <div class="content">
      <div class="pure-g add-list">
        <div style="width: 100%; height: 100%">
          <div class="turnover-group">
            <span>Kategorie:
                <el-select
                  v-model="catid"
                  clearable
                  class="s-rcategories2 rinput"
                  @change="setCat">
                <el-option
                v-for="item in selectOptionsCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </span>            
            <button style="margin-left:18em" title="Neues Rezept anlegen" class="button" @click="createRecipe()">Neues Rezept anlegen</button>
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
      recipes: {},
      catid: null,
      selectOptionsCategory: []
    };
  },
  computed: {
    ...mapGetters([
      'gcatid'
    ])
  },
  methods: {
    goToRecipe(id) {
      this.$router.push({ name: 'recipe', params: { id: id } });
    },
    setCat() {
      this.$store.dispatch('setCat', this.catid);
      this.getRecipes();
    },
    async createRecipe() {
      const recipe = {
        name: 'Rezeptname',
        portions: 4,
        recipecategory_id: 6,
        imgpath: ''
      };

      if (this.gcatid > 0) recipe.recipecategory_id = this.gcatid;

      await HTTP.post('/api/recipes', recipe);
      const response = await HTTP.get('api/recipe/max');

      recipe.imgpath = `https://admin.matbz.com/${response.data.maxid}.jpg`;

      await HTTP.put(`/api/recipes/${response.data.maxid}`, recipe);

      this.goToRecipe(response.data.maxid);
    },
    async deleteRecipe(id) {
      await HTTP.delete(`/api/recipes/${id}`);
      this.getRecipes();
    },
    async getRecipes() {
      let response = null;

      if (this.gcatid > 0) {
        response = await HTTP.get(`/api/irecipes/${this.gcatid}`);
      } else {
        response = await HTTP.get('/api/recipes');
      }
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
  async created() {
    this.getRecipes();

    const response = await HTTP.get('api/recipecategories');
    this.categories = response.data;

    this.categories.forEach(e => {
      this.selectOptionsCategory.push({
        value: e.id,
        label: e.name
      });
    });

    if (this.gcatid > 0) this.catid = this.gcatid;
  },
};
</script>
