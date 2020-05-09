const db = require('../db');
const SQL = require('sql-template-strings');

class RecipeCategory {
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
    this.imgpath = data.imgpath;
  }

  async backup() {
    try {
      const query = SQL`select * from recipecategory`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async all() {
    try {
      const query = SQL`select * from recipecategory order by position`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async delete(id) {
    try {
      const query = SQL`
      delete from recipecategory
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
      position,
      imgpath
    } = data;

    try {
      const query = SQL`
      insert into recipecategory
      (id, name, position, imgpath)
      values
      (${id}, ${name}, ${position}, ${imgpath})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }    
}

module.exports = RecipeCategory;
