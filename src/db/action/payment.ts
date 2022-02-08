// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Payment } from "../../getdb"
interface NewPayment {
  key: string | null;
  label: string | null;
  price: number | null;
  group: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  id?: number | null;
}
/** 
 * Returns all Users
 * @method getAllUsers
 * @returns {Array<NewPayment>} All Users belonging to User Model 
*/
const findByName = async (name: string) => {
  const users = await Payment.findOne({ where: { key: name } })
  return users
}

const findAll = async () => {
  const items = await Payment.findAll()
  return items
}


const findGroup = async (group: string) =>  {
  const items = await Payment.findAll({where: { group: group }})
  return items
}
/** 
 * Returns all Users
 * @method create
 * @param {NewPayment} paymeny the user object
 * @returns {NewPayment} the created User Object
*/
const create = async (paymeny: NewPayment) => {
  paymeny.createdAt = new Date
  const retData = await Payment.create(paymeny)
  const addedUser: NewPayment = {
    key: retData.key,
    label: retData.label,
    price: retData.price,
    group: retData.group,
    createdAt: new Date,
    id: retData.id,
  }
  return retData.id
}

export { findByName, create, findAll, findGroup }