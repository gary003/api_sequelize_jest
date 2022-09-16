import { moneyTypes } from "../../../../../../src/services/user/dto"
import * as serviceDataModule from "../../../../../../src/services/user"

describe("src > servicesData > user", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("should transfert money", async () => {
    const res = await serviceDataModule.transfertMoney(moneyTypes.SOFTCURRENCY, "35269564-0234-11ed-b939-0242ac120002", "68965564-0234-11ed-b939-0242ac120002", 25)
    // console.log({ res })

    expect(res).toBeTruthy()
  })
})
