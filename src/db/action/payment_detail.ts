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
  academicYearId: number | null;
  createdAt?: Date | null;
  referId?: number | null;
  isInstalment?: boolean | null;
  id?: number | null;
}

interface DetailResult {
  rows: Array<model>;
  count: number | 0;
}
const findPaginatedQuery = "SELECT payment_details.*, payments.label as payment_name, students.name as student_name FROM payment_details JOIN payments on payment_details.payment_id=payments.id JOIN students on payment_details.student_id=students.id ORDER BY payment_details.id DESC LIMIT {limit} OFFSET {offset}"
const constPaginatedQuery = "SELECT COUNT(payment_details.id) as count FROM payment_details"


const findByStudentIdPaginatedQuery = "SELECT payment_details.*, payments.label as payment_name FROM payment_details JOIN payments on payment_details.payment_id=payments.id WHERE payment_details.student_id = {studentId} ORDER BY payment_details.id DESC LIMIT {limit} OFFSET {offset}"
const constByStudentIdPaginatedQuery = "SELECT COUNT(payment_details.id) as count FROM payment_details WHERE payment_details.student_id = {studentId}"

const findByStudentIdQuery = `
  SELECT 
    payment_details.id as id_detail, 
    payment_details.description, 
    payment_details.academic_year_id as academicYearId, 
    payment_details.pay, payments.* 
  FROM 
    payment_details 
  JOIN 
    payments ON payments.id=payment_details.payment_id 
  WHERE 
    payment_details.student_id={studentId}
`
/** 
 * Returns all Users
 * @method getAllUsers
 * @returns {Array<NewDetail>} All Users belonging to User Model 
*/
const findAll = async () => {
  const users = await PaymentDetail.findAll()
  return users
}

const findByStudentIdAndAcademicYear = async (studentId: number, academicYearId: number) => {
  const details = await PaymentDetail.findAll({
    where: {
      studentId: studentId,
      academicYearId: academicYearId,
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

const findPaginated = async (payload: DetailsPaginatedPayload) => {
  const result: DetailResult = {
    rows: [],
    count: 0
  }
  let findQuery = findPaginatedQuery
  const countQuery = constPaginatedQuery


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

  return retData.id
}

const findByStudentId = async (id: number) => {
  let result: any

  let findQuery = findByStudentIdQuery

  findQuery = findQuery.replace('{studentId}', id.toString())

  await sequelize.query(findQuery).then((res: any) => {
      result = res[0]
  })

  return result
}

export { findAll, create, findByStudentIdAndAcademicYear, findByStudentIdPaginated, findPaginated, findByStudentId}