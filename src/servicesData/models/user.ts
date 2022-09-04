import { DataTypes } from "sequelize"
import { createConnectionSequelize } from "../dataSource/link"
import Wallet from "./wallet"

const User = createConnectionSequelize().define(
  "User",
  {
    // Model attributes are defined here
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user",
    // Other model options go here
    createdAt: false,
    updatedAt: false,
  }
)

User.hasOne(Wallet, {
  foreignKey: "userId",
})

export default User
