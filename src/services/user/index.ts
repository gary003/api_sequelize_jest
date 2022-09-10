import { getAllUsersDB, getUserInfoById } from "../../servicesData/user"
import { userDTO } from "./dto"

export const getAllUsers = async (): Promise<userDTO[]> => {
  const allUsers: userDTO[] = (await getAllUsersDB()) as unknown as userDTO[]

  return allUsers
}

export const getUser = async (userId: string): Promise<userDTO> => {
  console.log({ userId })

  const user: userDTO = (await getUserInfoById(userId)) as unknown as userDTO

  console.log({ user })

  if (!user) throw new Error("user not found in DB")

  return user
}
