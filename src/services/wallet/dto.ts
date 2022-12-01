import { moneyTypes } from "../../domain"

export type walletDTO = Partial<Record<moneyTypes, string | number>> & {
  walletId: string
}
