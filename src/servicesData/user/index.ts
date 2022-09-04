import { Model } from "sequelize/types"
import User from "../models/user"
import Wallet from "../models/wallet"
import { cleanSequelizeResponse, getAttributesToSelect } from "../helpers/index"
import { userAttributeToSelect, walletAttributeToSelect } from "./dto2"

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
