import { walletDTO } from "../wallet/dto"

export type userDTO = {
  userId: string
  firstname: string
  lastname: string
  Wallet?: walletDTO // softCurrency: number
}

const us: userDTO = {
  userId: "",
  firstname: "",
  lastname: "",
  Wallet: {
    walletId: "azzr",
    hardCurrency: 123,
  },
}

console.log(us)
