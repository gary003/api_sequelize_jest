import { Model, Transaction } from "sequelize/types"
import User from "../models/user"
import Wallet from "../models/wallet"
import { cleanSequelizeResponse } from "../helpers/index"
import { userAttributes, userInfo, walletAttributes } from "./dto2"
import { commitTransaction, createAndStartTransaction, createConnectionSequelize, rollbackTransaction } from "../dataSource/link"
import { moneyTypes } from "../wallet/dto"

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

export const transfertMoney = async (currency: moneyTypes, giverId: string, recipientId: string, amount: number) => {
  if (!Object.values(moneyTypes).includes(currency)) throw new Error("wrong type of currency")

  const giverUserInfo: userInfo = await getUserInfoById(giverId)

  const giverNewBalance = Number(giverUserInfo[currency as unknown as keyof userInfo]) - amount

  if (giverNewBalance < 0) throw new Error("Not enough funds to make transaction")

  // console.log({ giverUserInfo, giverNewBalance })

  const giverWalletToUpdate: Model | null = await Wallet.findOne({ where: { userId: giverId }, raw: true }).catch((err) => err)

  const transacRunner: Transaction = await createAndStartTransaction().catch((err) => err)

  if (!transacRunner) throw new Error("Impossible to create transaction")

  if (!giverWalletToUpdate) throw new Error("No giver wallet to update")

  // console.log({ giverUserInfo, giverNewBalance, giverWalletToUpdate })

  // @ts-ignore
  const updateWalletGiverResult = await Wallet.update({ [currency]: giverNewBalance }, { where: { walletId: giverWalletToUpdate.walletId }, transaction: transacRunner }).catch((err) => err)

  // console.log({ updateWalletGiverResult })

  if (!updateWalletGiverResult || updateWalletGiverResult[0] === 0) {
    rollbackTransaction(transacRunner)
    throw new Error("Impossible to update the giver wallet info")
  }

  // Then, we do some calls passing this transaction as an option:
  const recipientUserInfo = (await getUserInfoById(recipientId)) as userInfo

  // @ts-ignore
  const recipientNewBalance = Number(recipientUserInfo[currency]) + amount

  // console.log({ recipientUserInfo, recipientNewBalance })

  const recipientWalletToUpdate: Model | null = await Wallet.findOne({ where: { userId: recipientId }, raw: true }).catch((err) => err)

  if (!recipientWalletToUpdate) {
    rollbackTransaction(transacRunner)
    throw new Error("No recipient wallet to update")
  }

  // // @ts-ignore
  // console.log(recipientWalletToUpdate.walletId, { recipientNewBalance })

  // @ts-ignore
  const updateWalletRecipientResult = await Wallet.update({ [currency]: recipientNewBalance }, { where: { walletId: recipientWalletToUpdate.walletId }, transaction: transacRunner })

  // console.log({ updateWalletRecipientResult })

  if (updateWalletRecipientResult[0] === 0) {
    rollbackTransaction(transacRunner)
    throw new Error("Impossible to update the recipient wallet info")
  }

  commitTransaction(transacRunner)

  return true
}
