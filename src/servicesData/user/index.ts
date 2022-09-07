import { Model, Transaction } from "sequelize/types"
import User from "../models/user"
import Wallet from "../models/wallet"
import { cleanSequelizeResponse, getAttributesToSelect } from "../helpers/index"
import { userAttributeToSelect, walletAttributeToSelect } from "./dto2"
import { createConnectionSequelize } from "../dataSource/link"

export const getUserInfoById = async (userId: string) => {
  const userAttributesToSelect = await getAttributesToSelect(userAttributeToSelect)
  const walletAttributesToSelect = await getAttributesToSelect(walletAttributeToSelect)

  const result: Model | null = await User.findOne({
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

  if (!result) throw new Error("User not found")

  return await cleanSequelizeResponse([result])
}

export const getAllUsersDB = async () => {
  const userAttributesToSelect = await getAttributesToSelect(userAttributeToSelect)
  const walletAttributesToSelect = await getAttributesToSelect(walletAttributeToSelect)

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

export const transfertMoney = async (currency: string, giverId: string, recipientId: string, amount: number) => {
  const userAttributesToSelect = await getAttributesToSelect(userAttributeToSelect)
  const walletAttributesToSelect = await getAttributesToSelect(walletAttributeToSelect)

  const t = await createConnectionSequelize().transaction()

  try {
    // Then, we do some calls passing this transaction as an option:
    const [giverUserInfo]: Object[] = await getUserInfoById(giverId)

    // @ts-ignore
    const giverNewBalance = Number(giverUserInfo[currency]) - amount

    // console.log({ giverUserInfo, giverNewBalance })

    const giverWalletToUpdate: Model | null = await Wallet.findOne({ where: { userId: giverId }, raw: true })

    if (!giverWalletToUpdate) throw new Error("No giver wallet to update")

    // @ts-ignore
    // console.log({ giverUserInfo, giverNewBalance, giverWalletToUpdate })

    // @ts-ignore
    const updateWalletGiverResult = await Wallet.update({ [currency]: giverNewBalance }, { where: { walletId: giverWalletToUpdate.walletId }, transaction: t }).catch((err) => console.log(err))

    console.log({ updateWalletGiverResult })

    if (!updateWalletGiverResult || updateWalletGiverResult[0] === 0) {
      throw new Error("Impossible to update the giver wallet info")
    }

    // Then, we do some calls passing this transaction as an option:
    const [recipientUserInfo]: Object[] = await getUserInfoById(recipientId)

    // @ts-ignore
    const recipientNewBalance = Number(recipientUserInfo[currency]) + amount

    console.log({ recipientUserInfo, recipientNewBalance })

    const recipientWalletToUpdate: Model | null = await Wallet.findOne({ where: { userId: recipientId }, raw: true })

    if (!recipientWalletToUpdate) throw new Error("No recipient wallet to update")

    // @ts-ignore
    console.log(recipientWalletToUpdate.walletId, { recipientNewBalance })

    // @ts-ignore
    const updateWalletRecipientResult = await Wallet.update({ [currency]: recipientNewBalance }, { where: { walletId: recipientWalletToUpdate.walletId }, transaction: t })

    console.log({ updateWalletRecipientResult })

    if (updateWalletRecipientResult[0] === 0) {
      throw new Error("Impossible to update the recipient wallet info")
    }

    await t.commit()

    return true
  } catch (error) {
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    console.log({ error })

    await t.rollback()

    return false
  }
}
