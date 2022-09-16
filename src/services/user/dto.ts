export type userDTO = {
  userId: string
  // firstname: string
  lastname: string
  softCurrency: number
}

export enum moneyTypes {
  SOFTCURRENCY = "softCurrency",
  HARDCURRENCY = "hardCurrency",
}
