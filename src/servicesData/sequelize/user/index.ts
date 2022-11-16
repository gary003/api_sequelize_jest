import { Model, Transaction } from "sequelize/types"
import User from "../models/user"
import Wallet from "../models/wallet"
import { userAttributes, userInfo, walletAttributes } from "./dto2"
import { QueryTypes } from "sequelize"

export const getUserInfoById = async (userId: string): Promise<userInfo> => {
  const userAttributesToSelect = Object.values(userAttributes)
  const walletAttributesToSelect = Object.values(walletAttributes)

  const foundUser: Model | null = await User.findOne({
    include: [
      {
        model: Wallet,
        attributes: walletAttributesToSelect,
      },
    ],
    attributes: userAttributesToSelect,
    where: {
      userId,
    },
    raw: true,
    nest: true,
    type: QueryTypes.SELECT,
  })

  if (!foundUser) throw new Error("User not found")

  return foundUser as unknown as userInfo
}

export const getAllUsersDB = async (): Promise<userInfo[]> => {
  const userAttributesToSelect = Object.values(userAttributes)
  const walletAttributesToSelect = Object.values(walletAttributes)

  const allUsersInfo: Model[] = await User.findAll({
    include: [
      {
        model: Wallet,
        attributes: walletAttributesToSelect,
      },
    ],
    attributes: userAttributesToSelect,
    raw: true,
    nest: true,
    type: QueryTypes.SELECT,
  })

  return allUsersInfo as unknown as userInfo[]
}
