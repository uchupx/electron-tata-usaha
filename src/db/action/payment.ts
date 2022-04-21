// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Op } from "sequelize";
import { Payment } from "../../getdb"
interface NewPayment {
  key: string | null;
  label: string | null;
  price: number | null;
  group: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  isActive: boolean | null;
  id?: number | null;
}

/** 
 * Return model Payment
 * @param {string} name
 * @method findByName
 * @returns {Payment}
*/
const findByName = async (name: string) => {
  const payment = await Payment.findOne({ where: { key: name } })
  return payment
}

/**
 * Return model Payment
 * @param {number} id
 * @method findById
 * @returns {Payment}
 */
const findById = async (id: number) => {
  const payment = await Payment.findOne({ where: { id: id } })
  return payment
}

const findAll = async (includeInactive = true) => {
  const items = await Payment.findAll()
  let tmp: Payment[] = []
  if (!includeInactive) {
    for (const index in items) {
      const item = items[index]
      if (item.isActive) {
        tmp.push(item)
      }
    }
  } else {
    tmp = items
  }

  return tmp
}

/**
 * Return model Array<Payment>
 * @param {Array<number>} ids
 * @method findByIds
 * @returns {Array<Payment>}
 */
const findByIds = async (ids: Array<number>) => {
  const result = await Payment.findAll({ where: { Id: { [Op.in]: ids } } })

  return result
}

const findGroup = async (group: string) => {
  const items = await Payment.findAll({ where: { group: group } })
  return items
}
/** 
 * Returns all Users
 * @method create
 * @param {NewPayment} paymeny the payment object
 * @returns {number} the id of created Object
*/
const create = async (paymeny: NewPayment) => {
  if (!paymeny.createdAt) {
    paymeny.createdAt = new Date
  }

  const retData = await Payment.create(paymeny)

  return retData.id
}

/**
 * @method update
 * @param {Payment} payment 
 * @returns {number}
 */
const update = async (payment: Payment) => {
  await payment.save()

  return payment.id
}

export { findByName, create, findAll, findGroup, findById, update, findByIds }