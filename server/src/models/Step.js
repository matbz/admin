const db = require('../db');
const SQL = require('sql-template-strings');

class Step {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.step = data.step;
    this.position = data.position;
    this.recipe_id = data.recipe_id;
  }

  async all(id) {
    try {

      const query = SQL`select * from recipestep where recipe_id = ${id} order by position`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findByRecipeId(id) {
    try {
      const query = SQL`
      select *
      from recipestep
      where recipe_id = ${id}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      step,
      recipe_id,
    } = data;

    try {
      const query = SQL`
      insert into recipestep
      (step, recipe_id)
      values
      (${step}, ${recipe_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      step
    } = data;

    try {
      const query = SQL`
      update recipestep
      set
        step = ${step}
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
          update recipestep
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
      delete from recipestep
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Step;
