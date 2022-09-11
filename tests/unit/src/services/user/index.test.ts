// require("dotenv").config()

import { describe, expect } from "@jest/globals"
import { getAllUsers, getUser } from "../../../../../src/services/user"
import * as serviceDataModule from "../../../../../src/servicesData/sequelize/user"
import { moneyTypes } from "../../../../../src/servicesData/sequelize/wallet/dto"

describe("tests", () => {
  describe("src > services > user", () => {
    it("should get all the users from user DB service", async () => {
      const res = await getAllUsers()
      // console.log(res)

      expect(res).not.toBeNull()
      expect(res[0].userId).toBeDefined()
      expect(res[0].userId.length > 0).toBeTruthy()
    })

    it("should get one the user from user DB service from ID", async () => {
      const users = [{ userId: "fake_003665221", lastname: "fake_lastname" }]
      const resp = { data: users }

      const res = await getUser("68965564-0234-11ed-b939-0242ac120002")
      // console.log(res)

      expect(res).not.toBeNull()
      expect(res.userId).toBeDefined()
      expect(res.userId.length > 0).toBeTruthy()
    })

    it("should fail getting one the user from user DB", async () => {
      const fakeGetUserInfoById = jest.spyOn(serviceDataModule, "getUserInfoById")
      try {
        fakeGetUserInfoById.mockRejectedValue(new Error("Cannot get user"))

        await getUser("68965564-0234-11ed-b939-0242ac120002")
        // console.log(res)

        throw new Error("Should not happen")
      } catch (error) {
        console.log(error)
        expect(error).toBeTruthy()
        expect(fakeGetUserInfoById).toBeCalled()
        expect(error.message).toEqual("Cannot get user")
      }
    })
  })

  describe("src > servicesData > user", () => {
    it("should transfert money", async () => {
      const res = await serviceDataModule.transfertMoney(moneyTypes.SOFTCURRENCY, "35269564-0234-11ed-b939-0242ac120002", "68965564-0234-11ed-b939-0242ac120002", 40)
      // console.log({ res })

      expect(res).toBeTruthy()
    })
  })
})
