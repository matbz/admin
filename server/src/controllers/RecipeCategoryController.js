const RecipeCategory = require('../models/RecipeCategory');

module.exports = {
  async index(req, res) {
    const recipecategory = new RecipeCategory();
    try {
      const results = await recipecategory.all();

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  }
};
