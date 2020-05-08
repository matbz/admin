const Ingredient = require('../models/Ingredient');

module.exports = {
  async index(req, res) {
    const ingredient = new Ingredient();
    try {
      const results = await ingredient.all(req.params.id);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async create(req, res) {
    const ingredient = new Ingredient();
    try {
      await ingredient.create(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async update(req, res) {
    const ingredient = new Ingredient();
    try {
      await ingredient.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
      });
    }
  },
  async updatePositions(req, res) {
    const ingredient = new Ingredient();
    try {
      await ingredient.updatePositions(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update positions of categories'
      });
    }
  },
  async delete(req, res) {
    const ingredient = new Ingredient();
    try {
      await ingredient.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an goal'
      });
    }
  }
};
