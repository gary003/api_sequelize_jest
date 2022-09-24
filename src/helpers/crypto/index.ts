// require('dotenv').config()

import * as crypto from "crypto-js"

const secretKey = process.env.CRYPTO_SECRET_KEY

if (!secretKey) throw new Error("Please specify a secretKey for encryption")

export const encryptData = async (str: string): Promise<string> => {
  const cipher: string = crypto.AES.encrypt(str, secretKey).toString()

  return cipher
}

export const decryptData = async (encryptedData: string): Promise<string> => {
  const bytes = crypto.AES.decrypt(encryptedData, secretKey)

  return bytes.toString(crypto.enc.Utf8)
}

// test functions
;(async () => {
  const encryptedPassword = await encryptData("azerty_pwd!")
  console.log({ secretKey }, encryptedPassword)
  console.log({ secretKey }, await decryptData(encryptedPassword))
})()

// import * as crypto from "crypto"

// const iv: Buffer = crypto.randomBytes(16)
// // There is restricions on the size of the secret key(that's why the special type is used)
// const secretKey: crypto.CipherKey = process.env.CRYPTO_SECRET_KEY
// const algorithm: string = process.env.CRYPTO_ALGORITHM

// export const encryptData = (str: string): string => {
//   const cipher: crypto.Cipher = crypto.createCipheriv(algorithm, secretKey, iv)
//   let encrypted: string = cipher.update(str, "utf-8", "hex")
//   encrypted += cipher.final("hex")

//   /*
//     !! The iv here (in the return) is different from the iv in the parameters.
//     It changes and will be different everytime, even for the same password).
//     So you have to pass it on to be able to decrypt the encrypted hash.
//   */
//   return `${encrypted}${iv.toString("hex")}`
// }

// export const decryptData = (encryptedData: string): string => {
//   const hash: string = encryptedData.slice(0, 32)
//   const iv: string = encryptedData.slice(32)

//   const decipher: crypto.Decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"))
//   let decrypted: string = decipher.update(hash, "hex", "utf-8")
//   decrypted += decipher.final("utf-8")

//   return decrypted
// }

// export const hashData = (str: string): string => {
//   const hashedData: string = crypto.createHash("sha1").update(str).digest("hex")
//   return hashedData
// }
