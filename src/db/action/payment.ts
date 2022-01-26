// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Payment } from "../../getdb"
interface NewPayment {
  price: number | null;
  name: string | null;
  key: string | null;
  group: string | null;
  id?: number | null;
}
/** 
 * Returns all Users
 * @method getAllUsers
 * @returns {Array<NewPayment>} All Users belonging to User Model 
*/
const findByName = async (name: string) => {
  const users = await Payment.findOne({ where: { name: name } })
  return users
}

/** 
 * Returns all Users
 * @method create
 * @param {NewPayment} user the user object
 * @returns {NewPayment} the created User Object
*/
const create = async (user: NewPayment) => {
  const retData = await Payment.create(user)
  const addedUser: NewPayment = {
    price: retData.price,
    name: retData.name,
    key: retData.key,
    group: retData.group,
    id: retData.id,
  }
  return retData.id
}

export { findByName, create }