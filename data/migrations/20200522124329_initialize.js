
exports.up = function(knex) {
  return knex.schema.createTable('cars', tbl=>{
    tbl.increments('id');
    tbl.varchar('vin', 32).notNullable().unique();
    tbl.varchar('make', 128).notNullable();
    tbl.varchar('model', 128).notNullable();
    tbl.integer('mileage').notNullable();
    tbl.varchar('transmission_type', 128);
    tbl.varchar('title_status', 128);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cars');
};
