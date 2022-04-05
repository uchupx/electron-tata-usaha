import { Class, } from "@/getdb"
import { Op } from "sequelize";

interface NewClass {
  name: string | null;
  id?: number | null;
}

const findAll = async () => {
  const result = await Class.findAll()

  return result
}

const findByIds = async (ids: Array<number>) => {
  const results = await Class.findAll({
    where: {
      id: {
        [Op.in]: ids
      }
    }
  })

  return results
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

const update = async (data: Class) => {
  await data.save()

  return data.id
}


export { findAll, create, isClassExist, findByIds, update }