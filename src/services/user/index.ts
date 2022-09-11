import { getAllUsersDB, getUserInfoById } from "../../servicesData/user"
import { userDTO } from "./dto"

export const getAllUsers = async (): Promise<userDTO[]> => {
  const allUsers: userDTO[] = (await getAllUsersDB()) as userDTO[]

  return allUsers
}

export const getUser = async (userId: string): Promise<userDTO> => {
  const user: userDTO = (await getUserInfoById(userId)) as userDTO

  if (!user) throw new Error("user not found in DB")

  return user
}
