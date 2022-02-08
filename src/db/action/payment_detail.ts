// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { PaymentDetail, sequelize } from "../../getdb"
import { DetailsPaginatedPayload } from "../enums/paginated"
import { PaymentDetail as model } from "../model/payment"
import { create as createActivity } from "@/db/action/activity"
import { entityPaymentDetail } from "../enums/activity"
import { entityCreate } from "../model/activity"

interface NewDetail {
  pay: number;
  description: string | null;
  studentId: number | null;
  paymentId: number | null;
  createdAt?: Date | null;
  referId?: number | null;
  isInstalment?: boolean | null;
  id?: number | null;
}

interface DetailResult {
  rows: Array<model>;
  count: number | 0;
}



const findByStudentIdPaginatedQuery = "SELECT payment_details.*, payments.label as payment_name FROM payment_details JOIN payments on payment_details.payment_id=payments.id WHERE payment_details.student_id = {studentId} ORDER BY payment_details.id DESC LIMIT {limit} OFFSET {offset}"
const constByStudentIdPaginatedQuery = "SELECT COUNT(payment_details.id) as count FROM payment_details WHERE payment_details.student_id = {studentId}"
/** 
 * Returns all Users
 * @method getAllUsers
 * @returns {Array<NewDetail>} All Users belonging to User Model 
*/
const findAll = async () => {
  const users = await PaymentDetail.findAll()
  return users
}

const findByPaymentIdAndStudentId = async (paymentId: number, studentId: number) => {
  const details = await PaymentDetail.findOne({
    where: {
      studentId: studentId,
      paymentId: paymentId,
    },
    order: [['id', 'DESC']],
  })
  return details
}


/** 
 * Returns all Students
 * @method findPaginated
 * @param {PaginatedPayload} student the user object
 * @returns {DetailResult} the created User Object
*/
const findByStudentIdPaginated = async (id: number, payload: DetailsPaginatedPayload) => {
  const result: DetailResult = {
    rows: [],
    count: 0
  }
  let findQuery = findByStudentIdPaginatedQuery
  let countQuery = constByStudentIdPaginatedQuery

  findQuery = findQuery.replace('{studentId}', id.toString())
  countQuery = countQuery.replace('{studentId}', id.toString())

  findQuery = findQuery.replace('{offset}', payload.offset.toString())
  findQuery = findQuery.replace('{limit}', payload.limit.toString())

  await sequelize.query(countQuery).then(async (res: any) => {
    if (res[0].length > 0) {
      result.count = res[0][0].count
      await sequelize.query(findQuery).then((res: any) => {
        result.rows = res[0]
      })
    }
  })

  return result
}
/** 
 * Returns all Users
 * @method createUser
 * @param {NewDetail} detail the user object
 * @returns {NewDetail} the created User Object
*/
const create = async (detail: NewDetail) => {
  detail.createdAt = new Date
  const retData = await PaymentDetail.create(detail)

  await createActivity({
    type: entityCreate,
    payload: retData,
    entityId: retData.id,
    entity: entityPaymentDetail,
  })

  const addedUser: NewDetail = {
    pay: retData.pay,
    description: retData.description,
    studentId: retData.studentId,
    paymentId: retData.paymentId,
    createdAt: new Date,
    referId: retData.referId,
    isInstalment: retData.isInstalment,
    id: retData.id,
  }
  return addedUser
}

export { findAll, create, findByPaymentIdAndStudentId, findByStudentIdPaginated }