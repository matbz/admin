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

  async backup() {
    try {
      const query = SQL`select * from ingredient`;

      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
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

  async findByCategoryGroupId(id) {
    try {
      const query = SQL`
      select *
      from ingredient
      where ingredientgroup_id = ${id}
      `;
      return await db.manyOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async getMaxPosition(id) {
    try {
      const query = SQL`select max(position) as maxpos from ingredient where ingredientgroup_id = ${id}`;

      return await db.oneOrNone(query);
    } catch (error) {
        console.log(error);
    }
  }

  async create(data) {
    const {
      name,
      quantity,
      measurement,
      identifier,
      ingredientgroup_id
    } = data;

    const response = await this.getMaxPosition(data.ingredientgroup_id);

    try {
      const query = SQL`
      insert into ingredient
      (name, quantity, measurement, identifier, ingredientgroup_id, position)
      values
      (${name}, ${quantity},${measurement},${identifier},${ingredientgroup_id}, ${response.maxpos + 1})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async update(id, data) {
    const {
      name,
      quantity,
      measurement,
      identifier,
    } = data;

    try {
      const query = SQL`
      update ingredient
      set
        name = ${name},
        quantity = ${quantity},
        measurement = ${measurement},
        identifier = ${identifier}
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
          update ingredient
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
      delete from ingredient
      where id = ${id}
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async deleteAll() {
    try {
      const query = SQL`
      delete from ingredient`;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }

  async restore(data) {
    const {
      id,
      name,
      quantity,
      measurement,
      identifier,
      position,
      ingredientgroup_id
    } = data;

    try {
      const query = SQL`
      insert into ingredient
      (id, name, quantity, measurement, identifier, position, ingredientgroup_id)
      values
      (${id}, ${name}, ${quantity}, ${measurement}, ${identifier}, ${position}, ${ingredientgroup_id})
      `;
      return await db.none(query);
    } catch (error) {
        console.log(error);
    }
  }
}

module.exports = Ingredient;
