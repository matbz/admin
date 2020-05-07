const db = require('../db');
const SQL = require('sql-template-strings');

class Ingredient {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.name = data.name;
    this.quantity = data.quantity;
    this.measurement = data.measurement;
    this.identifier = data.identifier;
    this.position = data.position;
    this.ingredientgroup_id = this.ingredientgroup_id;
  }

  async all(id) {
    try {
      const query = SQL`
      select * from ingredient where ingredientgroup_id = ${id} order by position
       `;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Ingredient;
