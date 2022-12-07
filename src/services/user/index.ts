import { moneyTypes } from "../../domain"
import { commitTransaction, createAndStartTransaction, rollbackTransaction } from "../../servicesData/sequelize/dataSource/link"
import { getAllUsersDB, getUserInfoById } from "../../servicesData/sequelize/user"
import { getWalletInfoByUserId, updateWalletTransaction } from "../../servicesData/sequelize/wallet"
import { userDTO } from "./dto"

export const getAllUsers = async (): Promise<userDTO[]> => {
  const allUsers: userDTO[] = (await getAllUsersDB()) as userDTO[]

  return allUsers
}

export const getUser = async (userId: string): Promise<userDTO> => {
  const user: userDTO = (await getUserInfoById(userId)) as userDTO

  if (!user) throw new Error("user not found in DB")

  return user
}

export const transfertMoneyParamsValidator = async (currency: moneyTypes, giverId: string, recipientId: string, amount: number) => {
  if (!Object.values(moneyTypes).includes(currency)) throw new Error("wrong type of currency")

  const giverUserInfo: any = await getUserInfoById(giverId)

  const giverNewBalance = Number(giverUserInfo[currency]) - amount

  if (giverNewBalance < 0) throw new Error("Not enough funds to make transaction")

  const recipientUserInfo: any = await getUserInfoById(recipientId)

  // console.log({ giverUserInfo, giverNewBalance, giverWalletToUpdate })

  giverUserInfo.newBalance = giverNewBalance

  return [giverUserInfo, recipientUserInfo]
}

export const transfertMoney = async (currency: moneyTypes, giverId: string, recipientId: string, amount: number) => {
  const [giverUserInfo, recipientUserInfo] = await transfertMoneyParamsValidator(currency, giverId, recipientId, amount)

  const transacRunner = await createAndStartTransaction().catch((err) => err)

  if (!transacRunner) throw new Error("Impossible to create transaction")

  const updateWalletGiverResult = await updateWalletTransaction(transacRunner, currency, giverUserInfo.walletId, giverUserInfo.newBalance).catch((err) => err)

  // console.log({ updateWalletGiverResult })

  if (!updateWalletGiverResult || updateWalletGiverResult[0] === 0) {
    rollbackTransaction(transacRunner)
    throw new Error("Impossible to update the giver wallet info")
  }

  // @ts-ignore
  const recipientNewBalance = Number(recipientUserInfo[currency]) + amount

  // console.log({ recipientUserInfo, recipientNewBalance })

  const recipientWalletToUpdate = await getWalletInfoByUserId(recipientId).catch((err) => err)

  if (!recipientWalletToUpdate) {
    rollbackTransaction(transacRunner)
    throw new Error("No recipient wallet to update")
  }

  // // @ts-ignore
  // console.log(recipientWalletToUpdate.walletId, { recipientNewBalance })

  // @ts-ignore
  const updateWalletRecipientResult = await updateWalletTransaction(transacRunner, currency, recipientWalletToUpdate.walletId, recipientNewBalance).catch((err) => err)

  // console.log({ updateWalletRecipientResult })

  if (updateWalletRecipientResult[0] === 0) {
    rollbackTransaction(transacRunner)
    throw new Error("Impossible to update the recipient wallet info")
  }

  commitTransaction(transacRunner)

  return true
}
