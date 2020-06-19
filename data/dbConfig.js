const knex = require("knex");
require('dotenv').config();

const knexfile = require("../knexfile.js");
const database = process.env.NODE_ENV || "development";

module.exports = knex(knexfile[database]);