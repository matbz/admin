const db = require('../db');
const SQL = require('sql-template-strings');

class RecipeTag {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.recipe_id = data.recipe_id;
    this.tag_id = data.tag_id;
  }

  async backup() {
    try {

      const query = SQL`select * from recipe_tag`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async deleteAll() {
    try {
      const query = SQL`
      delete from recipe_tag`;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findByRecipeId(id) {
    try {
      const query = SQL`
      select *
      from recipe_tag
      where recipe_id = ${id}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  // async all(id) {
  //   try {

  //     const query = SQL`select * from recipestep where recipe_id = ${id} order by position`;

  //     return await db.manyOrNone(query);
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  // async create(data) {
  //   const {
  //     step,
  //     recipe_id,
  //   } = data;

  //   try {
  //     const query = SQL`
  //     insert into recipestep
  //     (step, recipe_id)
  //     values
  //     (${step}, ${recipe_id})
  //     `;
  //     return await db.none(query);
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  // async update(id, data) {
  //   const {
  //     step
  //   } = data;

  //   try {
  //     const query = SQL`
  //     update recipestep
  //     set
  //       step = ${step}
  //     where id = ${id}
  //     `;
  //     return await db.none(query);
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  async delete(id) {
    try {
      const query = SQL`
      delete from recipe_tag
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async restore(data) {
    const {
      id,
      recipe_id,
      tag_id
    } = data;

    try {
      const query = SQL`
      insert into recipe_tag
      (id, recipe_id, tag_id)
      values
      (${id}, ${recipe_id}, ${tag_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }    
}

module.exports = RecipeTag;
