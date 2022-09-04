require("dotenv").config()
import { Sequelize } from "sequelize"

// Option 1: Passing a connection URI
export const createConnectionSequelize = () => {
  const uri = process.env.MYSQL_URI || ""

  const sequelize = new Sequelize(uri)

  sequelize.authenticate()

  return sequelize
}
