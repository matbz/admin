<template>
  <div class="ynab-u">
    <div class="header"></div>
    <div class="content">
      <div class="pure-g add-list">
        <div style="width: 100%; height: 100%">
          <div class="turnover-group">Name:
            <input
              type="text"
              class="rinput"
              style="width: 20em"
              v-model.lazy="recipe.name"
              @change="saveRecipe()">
            <span>Portionen:
              <input
                type="text"
                class="rinput"
                style="width: 2em"
                v-model.lazy="recipe.portions"
                @change="saveRecipe()"
              ></span>
            <span>Kategorie:
              <span class ="rinput" style="width: 10em; margin-left:16em">{{this.categories[recipe.recipecategory_id - 1].name}}</span>
                <el-select
                  v-model="selectedCategory"
                  class="s-rcategories rinput"
                  @change="saveRecipe">
                <el-option
                v-for="item in selectOptionsCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
              </el-select>
            </span>
          </div>
        </div>
      </div>

      <div class="rlabel"><span>Zutatengruppen</span>
        <button title="Neue Gruppe anlegen" class="button rcb" @click="createIG()">Neue Gruppe anlegen</button>
      </div>
      <table class="pure-table theader igt">
          <thead>
              <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Aktionen</th>
                  <th>Zutaten</th>
              </tr>
          </thead>
          <draggable v-model="list" handle=".dhandle" tag="tbody" @change="updateIGPositions()">
            <tr :class="{ igactive: selectedIG.id === item.id }" v-for="item in ingredientGroups" :key="item.name">
              <td><i class="fa fa-bars dhandle"></i></td>
              <td>{{ item.name }}</td>
              <td>
                <i class="fa fa-pencil-square-o" @click="editIG(item.id)" style="margin-right: 1em"></i>
                <i class="fa fa-trash-o" @click="deleteIG(item.id)"></i>
              </td>
              <td>
                <i class="fa fa-eye" @click="loadI(item.id)" style="margin-left: .6em"></i>
              </td>
            </tr>
          </draggable>
      </table>

      <div class="rlabel">Zutaten für {{selectedIG.name}}
        <button title="Neue Zutat anlegen" class="button rcb" @click="createI()">Neue Zutat anlegen</button>
      </div>
      <table class="pure-table theader igt">
          <thead>
              <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Menge</th>
                  <th>Mengeneinheit</th>
                  <th>Platzhalter</th>
                  <th>Aktionen</th>
              </tr>
          </thead>
          <draggable v-model="list" handle=".dhandle" tag="tbody" @change="updateIPositions()">
            <tr v-for="item in ingredients" :key="item.name">
              <td><i class="fa fa-bars dhandle"></i></td>
              <td>{{ item.name }}</td>
              <td class="center">{{ Number(item.quantity).toLocaleString() }}</td>
              <td class="center">{{ item.measurement }}</td>
              <td class="center">{{ item.identifier }}</td>
              <td>
                <i class="fa fa-pencil-square-o" @click="editI(item.id)" style="margin-right: 1em"></i>
                <i class="fa fa-trash-o" @click="deleteI(item.id)"></i>
              </td>
            </tr>
          </draggable>
      </table>

      <div class="rlabel">Zubereitungsschritte
        <button title="Neuer Schritt anlegen" class="button rcb" @click="createStep()">Neuer Schritt anlegen</button>
      </div>
      <table class="pure-table theader igt">
          <thead>
              <tr>
                  <th></th>
                  <th>Text</th>
                  <th>Aktionen</th>
              </tr>
          </thead>
          <draggable v-model="list" handle=".dhandle" tag="tbody" @change="updateStepPositions()">
            <tr v-for="item in steps" :key="item.id">
              <td><i class="fa fa-bars dhandle"></i></td>
              <td style="width: 45em">{{ item.step }}</td>
              <td>
                <i class="fa fa-pencil-square-o" @click="editStep(item.id)" style="margin-right: 1em"></i>
                <i class="fa fa-trash-o" @click="deleteStep(item.id)"></i>
              </td>
            </tr>
          </draggable>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import draggable from 'vuedraggable';
import RecipesListItem from './RecipesListItem';

export default {
  components: {
    RecipesListItem,
    draggable
  },
  props: [
    'id'
  ],
  data() {
    return {
      selectedCategory: '',
      selectOptionsCategory: [],
      selectedIG: {},
      categories: [],
      list: [
        { id: 1, name: "Abbyfffffffffffffffffffffffffffffffffffffffffffffffffff", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
    };
  },
  computed: {
    ...mapGetters([
      'recipes',
      'ingredientGroups',
      'steps',
      'ingredients'
    ]),
    recipe() {
      return this.recipes[0];
    }
  },
  methods: {
    findElement(arr, propName, propValue) {
      for (var i=0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
        return arr[i];
    },
    async getRecipe() {
      await this.$store.dispatch('getRecipe', this.id);
      await this.$store.dispatch('getIngredientGroups', this.recipe.id);
      await this.$store.dispatch('getSteps', this.recipe.id);
      await this.$store.dispatch('getIngredients', this.selectedIG.id);
    },
    createIG() {

    },
    updateIG(igid) {

    },
    deleteIG(igid) {

    },
    editIG() {

    },
    loadI(igid) {
      this.selectedIG = this.findElement(this.ingredientGroups, "id", igid);
      this.$store.dispatch('getIngredients', igid);
    },
    updateIGPositions() {

    },
    createI() {

    },
    updateI() {

    },
    deleteI() {

    },
    editI() {

    },
    updateIPositions() {

    },
    createStep() {

    },
    updateStep() {

    },
    deleteStep() {

    },
    editStep() {

    },
    updateStepPositions() {

    },
    saveRecipe() {
      console.log('save');

      // this.getRecipe();
    },
  },
  async created() {
    this.getRecipe();

    const response = await HTTP.get('api/recipecategories');
    this.categories = response.data;

    this.categories.forEach(e => {
      this.selectOptionsCategory.push({
        value: e.id,
        label: e.name
      });
    });
  }
};
</script>
