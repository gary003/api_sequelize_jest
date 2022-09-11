import { DataTypes } from "sequelize"
import { createConnectionSequelize } from "../dataSource/link"

const Wallet = createConnectionSequelize().define(
  "Wallet",
  {
    walletId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    softCurrency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hardCurrency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "wallet",
    createdAt: false,
    updatedAt: false,
  }
)

export default Wallet
