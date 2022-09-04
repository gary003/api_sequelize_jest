import { Model } from "sequelize/types"

export const cleanSequelizeResponse = async (responseObject: Model[]): Promise<Object[]> => {
  const res: Object[] = []

  for (let iKey = 0; iKey < responseObject.length; iKey += 1) {
    let key2: string = ""
    const result = {}

    for (let key of Object.keys(responseObject[iKey])) {
      if (key.match(/^.*\..*$/)) {
        key2 = key.split(".")[1] as string
      } else {
        key2 = key as string
      }

      // @ts-ignore
      result[key2] = responseObject[iKey][key]
    }

    res.push(result)
  }

  return res
}

export const getAttributesToSelect = async (attributesEnum: any): Promise<string[]> => {
  return Object.values(attributesEnum)
}
