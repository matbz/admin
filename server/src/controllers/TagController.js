const Step = require('../models/Step');

module.exports = {
  async index(req, res) {
    const step = new Step();
    try {
      const results = await step.all(req.params.id);

      res.json(results);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to get all categories'
      });
    }
  },
  async create(req, res) {
    const step = new Step();
    try {
      await step.create(req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to create an goal'
      });
    }
  },
  async update(req, res) {
    const step = new Step();
    try {
      await step.update(req.params.id, req.body);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to update an goal'
      });
    }
  },
  async delete(req, res) {
    const step = new Step();
    try {
// delete recipe_tags

      await step.delete(req.params.id);
      res.json(req.body);
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to delete an goal'
      });
    }
  }
};
