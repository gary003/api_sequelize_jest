import { getAllUsersDB } from "../../servicesData/user"
import { userDTO } from "./dto"

export const getAllUsers = async (): Promise<userDTO[]> => {
  const allUsers = (await getAllUsersDB()) as unknown as userDTO[]

  return allUsers
}
