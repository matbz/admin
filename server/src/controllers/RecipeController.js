const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Recipe = require('../models/Recipe');
const Step = require('../models/Step');
const IngredientGroup = require('../models/IngredientGroup');
const Ingredient = require('../models/Ingredient');
const RecipeCategory = require('../models/RecipeCategory');
const Tag = require('../models/Tag');
const RecipeTag = require('../models/RecipeTag');

module.exports = {
  async index(req, res) {
    const recipe = new Recipe();
    try {
      const results = await recipe.all(req.params.categoryid);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async get(req, res) {
    const recipe = new Recipe();
    try {
      const results = await recipe.findById(req.params.id);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async getMaxId(req, res) {
    const recipe = new Recipe();
    try {
      const results = await recipe.getMaxId();

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async create(req, res) {
    const recipe = new Recipe();
    const ingredientgroup = new IngredientGroup();

    try {
      await recipe.create(req.body);

      const results = await recipe.getMaxId();

      await ingredientgroup.create({'name': 'Basis', 'recipe_id': results.maxid })

      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async update(req, res) {
    const recipe = new Recipe();
    try {
      await recipe.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
      });
    }
  },
  async delete(req, res) {
    const recipe = new Recipe();
    const ingredientgroup = new IngredientGroup();
    const ingredient = new Ingredient();
    const step = new Step();
    const recipetag = new RecipeTag();

    let ingredients = [];

    try {
      const igs = await ingredientgroup.findByRecipeId(req.params.id);

      await asyncForEach(igs, async (ig) => {
       ingredients = await ingredient.findByCategoryGroupId(ig.id);

       await asyncForEach(ingredients, async (c) => {
        await ingredient.delete(c.id);
       })

       await ingredientgroup.delete(ig.id);
      })

      const steps = await step.findByRecipeId(req.params.id);

      await asyncForEach(steps, async (s) => {
        await step.delete(s.id);
       })

       const tags = await recipetag.findByRecipeId(req.params.id);

       await asyncForEach(tags, async (t) => {
         await recipetag.delete(t.id);
        })

      await recipe.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an categoryGroup'
      });
    }
  },
  async backup(req, res) {
    const data = {};
    const month = moment(new Date()).month() + 1;
    const filename = `backup_recipes_${moment(new Date()).year()}_${month}_${moment(new Date()).date()}`;
    const filepath = './uploads/' + filename + '.json';

    const recipe = new Recipe();
    const step = new Step();
    const ingredientgroup = new IngredientGroup();
    const ingredient = new Ingredient();
    const recipecategory = new RecipeCategory();
    const tag = new Tag();
    const recipetag = new RecipeTag();

    try {
      data['recipe'] = await recipe.backup();
      data['step'] = await step.backup();
      data['ingredientgroup'] = await ingredientgroup.backup();
      data['ingredient'] = await ingredient.backup();
      data['recipecategory'] = await recipecategory.backup();
      data['tag'] = await tag.backup();
      data['recipe_tag'] = await recipetag.backup();

      await asyncForEach(data['ingredient'], async (e) => {
        e.quantity = parseFloat(e.quantity);
      });

      fs.writeFile(filepath, JSON.stringify(data, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };

        res.download(filepath, filename + '.json', function() {
          fs.unlink(filepath, function (err) {
            if (err) {
                console.error(err);
            }
          });
        });
      });
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to backup the recipes'
      });
    }
  },
  async restore(req, res) {
    try {
      const file = req.file;
      const contents = fs.readFileSync(file.path);
      const data = JSON.parse(contents);

      const recipe = new Recipe();
      const step = new Step();
      const ingredientgroup = new IngredientGroup();
      const ingredient = new Ingredient();
      const recipecategory = new RecipeCategory();
      const tag = new Tag();
      const recipetag = new RecipeTag();

      // Delete
      await asyncForEach(data['recipe_tag'], async (e) => {
        await recipetag.delete(e.id);
      });
      
      await asyncForEach(data['step'], async (e) => {
        await step.delete(e.id);
      });
      
      await asyncForEach(data['ingredient'], async (e) => {
        await ingredient.delete(e.id);
      });

      await asyncForEach(data['ingredientgroup'], async (e) => {
        await ingredientgroup.delete(e.id);
      });

      await asyncForEach(data['tag'], async (e) => {
        await tag.delete(e.id);
      });

      await asyncForEach(data['recipe'], async (e) => {
        await recipe.delete(e.id);
      });

      await asyncForEach(data['recipecategory'], async (e) => {
        await recipecategory.delete(e.id);
      });

      // Insert
      await asyncForEach(data['recipecategory'], async (e) => {
        await recipecategory.restore(e);
      });

      await asyncForEach(data['recipe'], async (e) => {
        await recipe.restore(e);
      });

      await asyncForEach(data['tag'], async (e) => {
        await tag.restore(e);
      });      

      await asyncForEach(data['recipe_tag'], async (e) => {
        await recipetag.restore(e);
      });
      
      await asyncForEach(data['step'], async (e) => {
        await step.restore(e);
      });
      
      await asyncForEach(data['ingredientgroup'], async (e) => {
        await ingredientgroup.restore(e);
      });

      await asyncForEach(data['ingredient'], async (e) => {
        await ingredient.restore(e);
      });

      fs.unlinkSync(file.path);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to restore.'
      });
    }
  },
  async uploadimg(req, res) {
    try {
      const file = req.file;
      const contents = fs.readFileSync(file.path);
      const filename = 'test';
      const filepath = './uploads/' + filename + '.jpg';

      console.log('test');

       fs.writeFile('./uploads/test.jpg', contents, (err) => {
        if (err) {
            console.error(err);
            return;
        };
      });

      fs.unlinkSync(file.path);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to upload img.'
      });
    }
  }  
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
