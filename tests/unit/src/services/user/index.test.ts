// require("dotenv").config()
import { describe, expect, test } from "@jest/globals"
import { getAllUsers } from "../../../../../src/services/user"
import { transfertMoney } from "../../../../../src/servicesData/user"

describe("src > services > user", () => {
  it("should get all the users from user DB service", async () => {
    const res = await getAllUsers()
    // console.log(res)

    expect(res).not.toBeNull()
    expect(res[0].userId).toBeDefined()
    expect(res[0].userId.length > 0).toBeTruthy()
  })

  it("should transfert money", async () => {
    const res = await transfertMoney("softCurrency", "35269564-0234-11ed-b939-0242ac120002", "68965564-0234-11ed-b939-0242ac120002", 40)
    console.log({ res })

    expect(res).toBeTruthy()
  })
})
