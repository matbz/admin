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
    this.position = data.position;
    this.recipe_id = this.recipe_id;
  }

  async all(id) {
    try {
      const query = SQL`select * from ingredientgroup where recipe_id = ${id} order by position`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findByRecipeId(id) {
    try {
      const query = SQL`
      select *
      from ingredientgroup
      where recipe_id = ${id}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      name,
      recipe_id
    } = data;

    try {
      const query = SQL`
      insert into ingredientgroup
      (name, recipe_id)
      values
      (${name}, ${recipe_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      name
    } = data;

    try {
      const query = SQL`
      update ingredientgroup
      set
        name = ${name}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async updatePositions(list) {
    try {
      await db.tx(t => {
        const queries = list.map(l => {
          const query = SQL`
          update ingredientgroup
          set
            position = ${l.position}
          where id = ${l.id}
          `;
          return t.none(query);
        });
        return t.batch(queries);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async delete(id) {
    try {
      const query = SQL`
      delete from ingredientgroup
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Ingredient;
