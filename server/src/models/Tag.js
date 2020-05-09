const db = require('../db');
const SQL = require('sql-template-strings');

class Tag {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.name = data.name;
    this.imgpath = data.imgpath;
  }

  async backup() {
    try {

      const query = SQL`select * from tag`;

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
      delete from tag
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
      name,
      imgpath
    } = data;

    try {
      const query = SQL`
      insert into tag
      (id, name, imgpath)
      values
      (${id}, ${name}, ${imgpath})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }    
}

module.exports = Tag;
