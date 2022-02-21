import { Class, } from "@/getdb"

interface NewClass {
  name: string | null;
  id?: number | null;
}

const findAll = async () => {
  const result = await Class.findAll()

  return result
}

const isClassExist = async (name: string) => {
  const result = await Class.findOne({
    where: {
      name: name
    }
  })

  return result?.id
}

const create = async (data: NewClass) => {
  const retData = await Class.create(data)
  return retData.id
}

export { findAll, create, isClassExist }