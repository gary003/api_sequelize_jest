import { assert } from "chai"
import { getAllUsers } from "../../../../../src/services/user"

describe("src > services > user", () => {
  it("should get all the users from user DB service", async () => {
    const res = await getAllUsers()
    // console.log(res)

    assert.isNotNull(res)
    assert.isString(res[0].userId)
    assert.isTrue(res[0].userId.length > 0)
  })
})
