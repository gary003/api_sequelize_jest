import { Model, Transaction } from "sequelize/types"
import User from "../models/user"
import Wallet from "../models/wallet"
import { cleanSequelizeResponse } from "../helpers/index"
import { userAttributes, userInfo, walletAttributes } from "./dto2"

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
  })

  if (!foundUser) throw new Error("User not found")

  const result = (await cleanSequelizeResponse([foundUser])) as userInfo[]

  return result[0]
}

export const getAllUsersDB = async () => {
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
  })

  return await cleanSequelizeResponse(allUsersInfo)
}
