import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User";
import configDatabase from "../config/database";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize('postgresql://postgres:HbzIzmpMwdmKLttXkgCSITfpMLfeMQVZ@monorail.proxy.rlwy.net:23657/railway');
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://mongo:fACTRlFTWAusgVujqRmULfDmAXzIPuhr@viaduct.proxy.rlwy.net:26583'
    );
  }
}

export default new Database();
