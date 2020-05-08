const Recipe = require('../models/Recipe');
const Step = require('../models/Step');
const IngredientGroup = require('../models/IngredientGroup');
const Ingredient = require('../models/Ingredient');

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

      await recipe.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an categoryGroup'
      });
    }
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
