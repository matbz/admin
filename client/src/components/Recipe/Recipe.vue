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
              <!-- <span class ="rinput" style="width: 10em; margin-left:16em">{{this.categories[recipe.recipecategory_id - 1].name}}</span> -->
                <el-select
                  v-model="recipe.recipecategory_id"
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
            <div style="margin-top: 1em;">
              <form enctype="multipart/form-data">
                <input class="inputfile" ref="fileinput" name="file" id="file" type="file" @change="onFileChange">
              </form>
              <!-- <input
                type="text"
                class="rinput"
                style="width: 18.5em"
                v-model.lazy="recipe.imgpath"
                @change="saveRecipe()"> -->
              <span>Bild:</span>
              <div style="margin-top: 1em">
                <img :src="imgsrc" width="100" height="100">
                <label style="margin: -2.7em 0 0 -3.6em; position: absolute" class="button button-cancel x-14 btn" for="file">
                  <i class="fa fa-upload"></i> Upload
                </label>
              </div>
            </div>

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
                  <th>Entfernen</th>
                  <th>Zutaten</th>
              </tr>
          </thead>
          <draggable v-model="igList" handle=".dhandle" tag="tbody" @change="updateIGPositions()">
            <ingredient-group-item
            v-for="item in igList"
            :item = "item"
            :key="item.id"
            ></ingredient-group-item>
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
                  <th>Entfernen</th>
              </tr>
          </thead>
          <draggable v-model="iList" handle=".dhandle" tag="tbody" @change="updateIPositions()">
            <ingredient-item
            v-for="item in iList"
            :item = "item"
            :key="item.id"
            ></ingredient-item>
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
                  <th>Entfernen</th>
              </tr>
          </thead>
          <draggable v-model="stepsList" handle=".dhandle" tag="tbody" @change="updateStepPositions()">
            <step-item
            v-for="item in steps"
            :item = "item"
            :key="item.id"
            ></step-item>
          </draggable>
      </table>
    </div>
    <modal-add-group :recipeid="id"></modal-add-group>
    <modal-add-ingredient></modal-add-ingredient>
    <modal-add-step :recipeid="id"></modal-add-step>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HTTP } from '@/common/utilities';
import draggable from 'vuedraggable';
import RecipesListItem from './RecipesListItem';
import StepItem from './StepItem';
import IngredientGroupItem from './IngredientGroupItem';
import IngredientItem from './IngredientItem';
import ModalAddStep from './ModalAddStep';
import ModalAddGroup from './ModalAddGroup';
import ModalAddIngredient from './ModalAddIngredient';

export default {
  components: {
    draggable,
    RecipesListItem,
    StepItem,
    IngredientGroupItem,
    IngredientItem,
    ModalAddStep,
    ModalAddGroup,
    ModalAddIngredient
  },
  props: [
    'id'
  ],
  data() {
    return {
      selectOptionsCategory: [],
      categories: [],
      recipe: {},
      stepsList: [],
      igList: [],
      iList: [],
      imgsrc: this.getImgsrc()
    };
  },
  computed: {
    ...mapGetters([
      'recipes',
      'ingredientGroups',
      'steps',
      'ingredients',
      'selectedIG'
    ])
  },
  watch: {
    '$store.state.recipe.refresh': function () {
      this.getRecipe();
    }
  },
  methods: {
    getImgsrc() {
      const src = `https://admin.matbz.com/${this.id}.jpg`;
      return src;
    },
    findElement(arr, propName, propValue) {
      for (var i=0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
        return arr[i];
    },
    async getRecipe() {
      await this.$store.dispatch('getRecipe', this.id);
      this.recipe = this.recipes[0];
      await this.$store.dispatch('getIngredientGroups', this.recipe.id);
      this.igList = this.ingredientGroups;
      await this.$store.dispatch('getIngredients', this.selectedIG.id);
      this.iList = this.ingredients;
      await this.$store.dispatch('getSteps', this.recipe.id);
      this.stepsList = this.steps;
    },
    createIG() {
      this.$modal.show('add-group-modal');
    },
    async updateIGPositions() {
      const sortedList = [];

      this.igList.forEach((e, index) => {
        sortedList.push({
          id: e.id,
          position: index + 1
        });
      });

      await HTTP.post('/api/ingredientgroups/positions', sortedList);

      this.getRecipe();
    },
    createI() {
      this.$modal.show('add-ingredient-modal');
    },
    async updateIPositions() {
      const sortedList = [];

      this.iList.forEach((e, index) => {
        sortedList.push({
          id: e.id,
          position: index + 1
        });
      });

      await HTTP.post('/api/ingredients/positions', sortedList);

      this.getRecipe();
    },
    createStep() {
      this.$modal.show('add-step-modal');
    },
    async updateStepPositions() {
      const sortedList = [];

      this.stepsList.forEach((e, index) => {
        sortedList.push({
          id: e.id,
          position: index + 1
        });
      });

      await HTTP.post('/api/steps/positions', sortedList);

      this.getRecipe();
    },
    async onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }

      const formData = new FormData();
      formData.append('imgFile', files[0]);

      HTTP.post(`/api/recipes/${this.id}/uploadimg`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      this.$toasted.success('Image uploaded. Page reloading...');

      setTimeout(() => {
        location.reload();
      }, 2000);
    },
    saveRecipe() {
      HTTP.put(`api/recipes/${this.recipe.id}`, this.recipe);
    },
  },
  async created() {
    await this.$store.dispatch('getRecipe', this.id);
    this.recipe = this.recipes[0];
    await this.$store.dispatch('getIngredientGroups', this.recipe.id);
    this.igList = this.ingredientGroups;
    if (this.ingredientGroups.length > 0) {
      await this.$store.dispatch('setIG', this.ingredientGroups[0]);
    } else {
      await this.$store.dispatch('setIG', {});
    }
    await this.$store.dispatch('getIngredients', this.selectedIG.id);
    this.iList = this.ingredients;
    await this.$store.dispatch('getSteps', this.recipe.id);
    this.stepsList = this.steps;

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
