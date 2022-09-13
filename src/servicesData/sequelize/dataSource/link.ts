require("dotenv").config()
import { Sequelize, Transaction } from "sequelize"

// Option 1: Passing a connection URI
export const createConnectionSequelize = () => {
  const uri = process.env.MYSQL_URI || ""

  const sequelize = new Sequelize(uri, {
    logging: false,
  })

  sequelize.authenticate()

  return sequelize
}

export const createAndStartTransaction = async () => {
  const transaction: Transaction = await createConnectionSequelize().transaction()

  return transaction
}

export const commitTransaction = (transac: Transaction) => {
  transac.commit()

  return true
}

export const rollbackTransaction = async (transac: Transaction) => {
  await transac.rollback()

  return true
}
