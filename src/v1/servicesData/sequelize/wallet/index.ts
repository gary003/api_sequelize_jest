import { Transaction } from "sequelize/types"
import { moneyTypes } from "../../../domain"
import Wallet from "../models/wallet"

export const getWalletInfoByUserId = async (userId: string) => {
  const walletInfo = await Wallet.findOne({ where: { userId: userId }, raw: true }).catch((err) => err)

  if (!walletInfo) throw new Error("Impossible to find user wallet")

  return walletInfo
}

export const updateWalletTransaction = async (queryRunner: Transaction, currency: moneyTypes, walletId: string, newBalance: number) => {
  const updateResult = await Wallet.update({ [currency]: newBalance }, { where: { walletId: walletId }, transaction: queryRunner })

  return updateResult
}
