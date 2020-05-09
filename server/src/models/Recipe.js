const db = require('../db');
const SQL = require('sql-template-strings');

class Recipe {
  constructor(data) {
    this.init(data);
  }

  init(data) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.name = data.name;
    this.portions = data.portions;
    this.imgpath = data.imgpath;
    this.recipecategory_id = data.recipecategory_id;
  }

  async backup() {
    try {
      const query = SQL`select * from recipe`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async all(categoryid) {
    try {
      const query = SQL`select * from recipe order by name`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async findById(id) {
    try {
      const query = SQL`select * from recipe where id = ${id}`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async getMaxId() {
    try {
      const query = SQL`select max(id) as maxid from recipe`;

      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      name,
      portions,
      imgpath,
      recipecategory_id
    } = data;

    try {
      const query = SQL`
      insert into recipe
      (name, portions, imgpath, recipecategory_id)
      values
      (${name}, ${portions},${imgpath},${recipecategory_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      name,
      portions,
      imgpath,
      recipecategory_id
    } = data;

    try {
      const query = SQL`
      update recipe
      set
        name = ${name},
        portions = ${portions},
        imgpath = ${imgpath},
        recipecategory_id = ${recipecategory_id}
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async delete(id) {
    try {
      const query = SQL`
      delete from recipe
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
      portions,
      imgpath,
      recipecategory_id
    } = data;

    try {
      const query = SQL`
      insert into recipe
      (id, name, portions, imgpath, recipecategory_id)
      values
      (${id}, ${name}, ${portions}, ${imgpath}, ${recipecategory_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }    
}

module.exports = Recipe;
