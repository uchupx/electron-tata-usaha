import { PaymentDetail } from "@/getdb";
import { Student as ModelStudent } from "@/db/model/student";
import { Payment as ModelPayment, PaymentDetail as ModelPaymentDetail } from "@/db/model/payment";
import * as Action from '@/db/action/payment_detail'
import { findByIds as findStudendByIds } from '@/db/action/student'
import { findByIds as findPaymentByIds } from '@/db/action/payment'
import { DetailsPaginatedPayload } from "@/db/enums/paginated";
import * as Types from "@/db/enums/types"

interface Relations {
  student: ModelStudent | null;
  payment: ModelPayment | null;
}

export interface PaymentWithRelations extends PaymentDetail {
  relations?: Relations | null;
}

interface PaginatedDetails {
  data: Array<PaymentWithRelations>;
  totalItems: number;
  limit: number;
  offset: number;
}

interface Map {
  [key: number]: any;
}

/** Returns all Students
* @method findPaymentWithRelation
* @param {query, relations} DetailsPaginatedPayload and array of string
* @returns {PaginatedDetails} the created User Object
*/
const findPaginatedPaymentWithRelation = async (query: DetailsPaginatedPayload, relations: Array<string>) => {
  const results = await Action.findRawPaginated(query)
  const details: PaginatedDetails = {
    data: [],
    totalItems: results.count,
    limit: query.limit,
    offset: query.offset,
  }
  const paymentIds = [] as Array<number>
  const studentIds = [] as Array<number>

  for (const idx in results.rows) {
    const tuple = results.rows[idx]
    const detail = new ModelPaymentDetail

    detail.rawTupleToModel(tuple)
    details.data.push(detail)

    if (relations.findIndex(i => i == Types.StudentsEnums) > -1) {
      studentIds.push(detail.studentId!)
    }

    if (relations.findIndex(i => i == Types.PaymentsEnums) > -1) {
      paymentIds.push(detail.paymentId!)
    }
  }

  if (relations.findIndex(i => i == Types.StudentsEnums) > -1) {
    const studentsMap = {} as Map
    const students = await findStudendByIds(studentIds)

    for (const idx in students) {
      const student = students[idx]
      studentsMap[student.id!] = student
    }

    for (const idx in details.data) {
      const data = details.data[idx]

      if (studentsMap[data.studentId!]) {
        if (!details.data[idx].relations) {
          details.data[idx].relations = {
            student: null,
            payment: null,
          }
        }
        details.data[idx].relations!.student = studentsMap[data.studentId!]
      }
    }
  }

  if (relations.findIndex(i => i == Types.PaymentsEnums) > -1) {
  const paymentsMap = {} as Map
    const payments = await findPaymentByIds(paymentIds)

    for (const idx in payments) {
      const payment = payments[idx]
      paymentsMap[payment.id!] = payment
    }

    for (const idx in details.data) {
      const data = details.data[idx]

      if (paymentsMap[data.paymentId!]) {
        if (!details.data[idx].relations) {
          details.data[idx].relations = {
            student: null,
            payment: null,
          }
        }
        details.data[idx].relations!.payment = paymentsMap[data.paymentId!]
      }
    }
  }

  return details;
}

export { findPaginatedPaymentWithRelation }