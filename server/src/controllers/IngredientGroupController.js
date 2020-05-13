const IngredientGroup = require('../models/IngredientGroup');
const Ingredient = require('../models/Ingredient');

module.exports = {
  async index(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      const results = await ingredientGroup.all(req.params.id);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async create(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      await ingredientGroup.create(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async update(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      await ingredientGroup.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
      });
    }
  },
  async updatePositions(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      await ingredientGroup.updatePositions(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update positions of categories'
      });
    }
  },
  async delete(req, res) {
    const ingredientGroup = new IngredientGroup();
    const ingredient = new Ingredient();

    try {
      const ingredients = await ingredient.findByCategoryGroupId(req.params.id);

      await asyncForEach(ingredients, async (c) => {
        await ingredient.delete(c.id);
      })

      await ingredientGroup.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an categoryGroup'
      });
    }
  },
  async get(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      const results = await ingredientGroup.findById(req.params.id);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async getMaxId(req, res) {
    const ingredientGroup = new IngredientGroup();
    try {
      const results = await ingredientGroup.getMaxId();
      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  }
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
