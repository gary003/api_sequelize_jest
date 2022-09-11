import { getUserInfoById } from "."

export enum userAttributes {
  USERID = "userId",
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
}

export enum walletAttributes {
  WALLETID = "walletId",
  SOFTCURRENCY = "softCurrency",
  // HARDCURRENCY = "hardCurrency",
}

export type userInfo = Record<userAttributes, string> & Record<walletAttributes, string | number>
