import { reset } from '@/db/action/misc'
import { create as createAcademicYear, isExist as academicYearIsExist } from '@/db/action/academic_year'
import { create as createActivity } from '@/db/action/activity'
import { create as createClass, isClassExist as classIsExist } from '@/db/action/class'
import { create as createDetail } from '@/db/action/payment_detail'
import { create as createPayment, findByName as paymentIsExist } from '@/db/action/payment'
import { create as createStudentClass, isExist as studentClassIsExist } from '@/db/action/student_class'
import { create as createStudent, isExist as studentIsExist } from '@/db/action/student'
interface RestorePayload {
  academic_years: [];
  activities: [];
  classes: [];
  payment_details: [];
  payments: [];
  student_classes: [];
  students: [];
}
export class RestoreHandler {
  private academicYears: Array<any>;
  private activities: Array<any>;
  private classes: Array<any>;
  private paymentDetails: Array<any>;
  private payments: Array<any>;
  private studentClasses: Array<any>;
  private students: Array<any>;

  constructor(payload: RestorePayload) {
    this.academicYears = payload.academic_years;
    this.activities = payload.activities;
    this.classes = payload.classes;
    this.paymentDetails = payload.payment_details;
    this.payments = payload.payments;
    this.studentClasses = payload.student_classes;
    this.students = payload.students;
  }

  public async doRestore(type: string) {
    const isDeleteAll = type === 'reset'

    if (isDeleteAll) {
      await reset()
    }

    for (const idx in this.students) {
      const student = this.students[idx]
      const studentClass = this.studentClasses.filter(i => i.studentId == student.id)
      const newStudentId = await this.doCreateStudent({
        name: student.name,
        address: student.address,
        semester: student.semester,
        gender: student.gender,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
        isOrphan: student.isOrphan,
      })

      for (const index in studentClass) {
        const cls = this.classes.find(i => i.id == studentClass[index].classId)
        const academicYear = this.academicYears.find(i => i.id == studentClass[index].academicYearId)
console.log(cls.name);
console.log(academicYear.label );

        const clsId = await this.doCreateClass({ name: cls.name })
        const academicYearId = await this.doCreateAcademicYear({ label: academicYear.label })

        await this.doCreateStudentClass({
          studentId: newStudentId,
          classId: clsId,
          academicYearId: academicYearId,
          createdAt: studentClass[index].createdAt,
          isActive: studentClass[index].isActive,
        })
      }
    }

    for (const idx in this.payments) {
      console.log('asdasd');
      
      await this.doCreatePayment({
        key: this.payments[idx].key,
        label: this.payments[idx].label,
        price: this.payments[idx].price,
        group: this.payments[idx].group,
        createdAt: this.payments[idx].createdAt,
        updatedAt: this.payments[idx].updatedAt,
        isActive: this.payments[idx].isActive,
      })
    }

    for (const idx in this.paymentDetails) {
      const oldAcademicYear = this.academicYears.find(i => i.id == this.paymentDetails[idx].academicYearId)
      const oldStudent = this.students.find(i => i.id == this.paymentDetails[idx].studentId)
      const oldPayment = this.payments.find(i => i.id == this.paymentDetails[idx].paymentId)

      const academicYearId = await academicYearIsExist(oldAcademicYear.label)
      const studentId = await studentIsExist(oldStudent.name)
      const payment = await paymentIsExist(oldPayment.key)

      await this.doCreatePaymentDetail({
        pay: this.paymentDetails[idx].pay,
        description: this.paymentDetails[idx].description,
        studentId: studentId,
        paymentId: payment?.id,
        academicYearId: academicYearId,
        createdAt: this.paymentDetails[idx].createdAt,
        referId: this.paymentDetails[idx].referId,
        isInstalment: this.paymentDetails[idx].isInstalment,
      })
    }

    return
  }

  private async doCreateAcademicYear(payload: any): Promise<number> {
    const isExist = await academicYearIsExist(payload.label)
    let academicYearId = 0
    if (!isExist) {
      const result = await createAcademicYear({
        label: payload.label
      })

      academicYearId = result!
    } else {
      academicYearId = isExist
    }

    return academicYearId
  }

  private async doCreateStudent(payload: any): Promise<number> {
    const isExist = await studentIsExist(payload.name)
    let id = 0

    if (!isExist) {
      const result = await createStudent({
        name: payload.name,
        address: payload.address,
        semester: payload.semester,
        gender: payload.gender,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
        isOrphan: payload.isOrphan,
      })

      id = result!
    } else {
      id = isExist
    }

    return id
  }

  private async doCreateClass(payload: any): Promise<number> {
    const isExist = await classIsExist(payload.name)
    let id = 0

    if (!isExist) {
      const result = await createClass({
        name: payload.name,
      })

      id = result!
    } else {
      id = isExist
    }

    return id
  }

  private async doCreateStudentClass(payload: any): Promise<number> {
    const result = await createStudentClass({
      studentId: payload.studentId,
      classId: payload.classId,
      academicYearId: payload.academicYearId,
      createdAt: payload.createdAt,
      isActive: payload.isActive,
    })

    return result!
  }

  private async doCreatePayment(payload: any): Promise<number> {
    const payment = await paymentIsExist(payload.key)
    let id = 0

    if (!payment) {
      const result = await createPayment({
        key: payload.key,
        label: payload.label,
        price: payload.price,
        group: payload.group,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
        isActive: payload.isActive,
      })

      id = result!
    } else {
      id = payment.id!
    }

    return id
  }

  private async doCreatePaymentDetail(payload: any): Promise<number> {
    const result = await createDetail({
      pay: payload.pay,
      description: payload.description,
      studentId: payload.studentId,
      paymentId: payload.paymentId,
      academicYearId: payload.academicYearId,
      createdAt: payload.createdAt,
      referId: payload.referId,
      isInstalment: payload.isInstalment,
    })

    return result!
  }
}
