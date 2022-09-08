export enum userAttributeToSelect {
  USERID = "userId",
  FIRSTNAME = "firstname",
  LASTNAME = "lastname",
}

export enum walletAttributeToSelect {
  WALLETID = "walletId",
  SOFTCURRENCY = "softCurrency",
  // HARDCURRENCY = "hardCurrency",
}

export type userType = Record<userAttributeToSelect, string>
export type walletType = Record<walletAttributeToSelect, string>

export type userInfo = userType & walletType
