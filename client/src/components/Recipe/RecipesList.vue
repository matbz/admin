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
            <span style="margin-left:18em">Suche:
              <input
                type="text"
                class="rinput"
                style="width: 15em"
                v-model="searchString"
                @keyup="search()"
              ></span>
            <button style="margin-left:1em" title="Neues Rezept anlegen" class="button" @click="createRecipe()">Neues Rezept anlegen</button>
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
            <tr v-for="item in recipeList" :key="item.id">
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
      recipes: [],
      catid: null,
      selectOptionsCategory: [],
      searchString: '',
      recipeList: [],
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
    search() {
      const foundRecipeIds = [];

      if (this.searchString.length < 3) {
        this.recipeList = this.recipes;
        return;
      }

      const searchS = this.searchString.toLowerCase();
      const recipesLower = this.recipes.map(e => {
        return { id: e.id, name: e.name.toLowerCase() };
      });

      recipesLower.forEach(r => {
        if (r.name.includes(searchS)) foundRecipeIds.push(r.id);
      });

      this.recipeList = this.recipes.filter(rec => foundRecipeIds.includes(rec.id));
    },
    setCat() {
      localStorage.setItem('cat', this.catid);
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
      this.recipeList = response.data;
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
    if (this.gcatid > 0) {
      this.catid = this.gcatid;
    } else {
      const lcat = localStorage.getItem('cat');
      if (lcat > 0) {
        this.$store.dispatch('setCat', Number(lcat));
        this.catid = Number(lcat);
        this.getRecipes();
      }
    }
  },
};
</script>
