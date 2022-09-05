require("dotenv").config()
import { describe, expect, test } from "@jest/globals"
import { getAllUsers } from "../../../../../src/services/user"

describe("src > services > user", () => {
  it("should get all the users from user DB service", async () => {
    const res = await getAllUsers()
    // console.log(res)

    expect(res).not.toBeNull()
    expect(res[0].userId).toBeDefined()
    expect(res[0].userId.length > 0).toBeTruthy()
  })
})
