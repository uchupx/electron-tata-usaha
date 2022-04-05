import { Student as ModelStudent } from "@/db/model/student";
import { Class as ModelClass } from "@/db/model/class";
import { Payment as ModelPayment, PaymentDetail as ModelPaymentDetail } from "@/db/model/payment";
import { findByIds as findStudendByIds } from '@/db/action/student'
import { findByIds as findPaymentByIds } from '@/db/action/payment'
import { findByIds as findClassByIds } from '@/db/action/class'
import { findByModelStudentId as findStudentClassesByStudentId } from '@/db/action/student_class'
import * as Types from "@/db/enums/types"

interface DetailRelations {
  student: StudentWithRelations | null;
  payment: ModelPayment | null;
}

interface StudentRelations {
  classes: Array<ModelClass>;
}

export interface PaymentWithRelations extends ModelPaymentDetail {
  relations?: DetailRelations | null;
}

export interface StudentWithRelations extends ModelStudent {
  relations?: StudentRelations | null;
}

interface Map {
  [key: number]: any;
}

export interface Relations {
  [ke: string]: string | Relations;
}


export class RelationHandler {

  /** Returns all Payment detail with relation
  * @method paymentDetailRelations
  * @param {query, relations} DetailsPaginatedPayload and array of string
  * @returns {PaginatedDetails} the created User Object
  */
  public async paymentDetailRelations(details: Array<PaymentWithRelations>, relations: Relations) {
    const paymentIds = [] as Array<number>
    const studentIds = [] as Array<number>

    for (const idx in details) {
      const detail = details[idx]

      if (this.includeRelations(relations, Types.StudentsEnums)) {
        studentIds.push(detail.studentId!)
      }

      if (this.includeRelations(relations, Types.PaymentsEnums)) {
        paymentIds.push(detail.paymentId!)
      }
    }

    if (this.includeRelations(relations, Types.StudentsEnums)) {
      const studentsMap = {} as Map
      let students = await findStudendByIds(studentIds)

      students = await this.studentRelations(students, relations[Types.StudentsEnums] as Relations)

      for (const idx in students) {
        const student = students[idx]
        studentsMap[student.id!] = student
      }


      for (const idx in details) {
        const data = details[idx]

        if (studentsMap[data.studentId!]) {
          if (!details[idx].relations) {
            details[idx].relations = {
              student: null,
              payment: null,
            }
          }
          details[idx].relations!.student = studentsMap[data.studentId!]
        }
      }
    }

    if (this.includeRelations(relations, Types.PaymentsEnums)) {
      const paymentsMap = {} as Map
      const payments = await findPaymentByIds(paymentIds)

      for (const idx in payments) {
        const payment = payments[idx]
        paymentsMap[payment.id!] = payment
      }

      for (const idx in details) {
        const data = details[idx]

        if (paymentsMap[data.paymentId!]) {
          if (!details[idx].relations) {
            details[idx].relations = {
              student: null,
              payment: null,
            }
          }
          details[idx].relations!.payment = paymentsMap[data.paymentId!]
        }
      }
    }

    return details;
  }

  /** Returns all Student with relation
  * @method studentRelations
  * @param {query, relations} Array<StudentWithRelations> and array of string
  * @returns {StudentRelations} the created User Object
  */
  public async studentRelations(students: Array<StudentWithRelations>, relations: Relations) {
    for (const idx in students) {
      const classIds = [] as Array<number>

      if (this.includeRelations(relations, Types.ClassesEnums)) {
        const studentClasses = await findStudentClassesByStudentId(students[idx].id!)

        for (const index in studentClasses) {
          classIds.push(studentClasses[index].classId!)
        }

        const classes = await findClassByIds(classIds)
        if (!students[idx].relations) {
          students[idx].relations = {
            classes: [],
          }
        }

        students[idx].relations!.classes = classes
      }
    }

    return students;
  }

  private includeRelations(relations: Relations, type: string) {
    return (Object.values(relations).findIndex(i => i == type) > -1) || (Object.keys(relations).findIndex(i => i == type) > -1)
  }
}

