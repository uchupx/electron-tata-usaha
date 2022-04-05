import { findAll as findAllAcademicYear } from '@/db/action/academic_year'
import { findAll as findAllClass } from '@/db/action/class'
import { findAll as findAllActivity } from '@/db/action/activity'
import { findAll as findAllPayment } from '@/db/action/payment'
import { findAll as findAllPaymentDetail } from '@/db/action/payment_detail'
import { findAll as findAllStudentClass } from '@/db/action/student_class'
import { findAll as findAllStudent } from '@/db/action/student'
import * as Types from "@/db/enums/types"
import { remote } from 'electron'
import axios from 'axios'
import fs from 'fs'

export class BackupHandler {
  public async createBackup(isUpload = false): Promise<string> {
    const backupRaw = await this.findAll()

    if (!isUpload) {
      return JSON.stringify(backupRaw)
    } else {
      const app = remote.app
      const rawData = fs.readFileSync(`${app.getPath("userData")}/config.json`, { encoding: 'utf8', flag: 'r' })
      const data = JSON.parse(rawData)

      if (!data.autoBackup) {
        return ''
      }

      const bodyForm = new FormData();
      const newBlob = new Blob([JSON.stringify(backupRaw)], {
        type: "text/plain",
      });

      const headers = {
        "Content-Type": "multipart/form-data",
      };

      bodyForm.append("backup-file", newBlob);
      axios
        .get(`${data.hostBackup}/backup/key`)
        .then((response) => {
          bodyForm.append("key", response.data.key);
          axios
            .post(`${data.hostBackup}/backup/upload`, bodyForm, {
              headers,
            })
        })
      return ''
    }
  }

  private async findAll() {
    const payload = {
      [Types.AcademicYearEnums]: Array<any>(),
      [Types.ClassesEnums]: Array<any>(),
      [Types.ActivityEnums]: Array<any>(),
      [Types.PaymentsEnums]: Array<any>(),
      [Types.PaymentDetailsEnums]: Array<any>(),
      [Types.StudentsClassEnums]: Array<any>(),
      [Types.StudentsEnums]: Array<any>(),
    }

    const academicYearModels = await findAllAcademicYear();
    const classModels = await findAllClass();
    const activityModels = await findAllActivity();
    const paymentModels = await findAllPayment();
    const paymentDetailModels = await findAllPaymentDetail();
    const studentClassModels = await findAllStudentClass();
    const studentModels = await findAllStudent();

    for (const idx in academicYearModels) {
      const data = academicYearModels[idx].toJSON()
      payload[Types.AcademicYearEnums].push(data)
    }

    for (const idx in classModels) {
      const data = classModels[idx].toJSON()
      payload[Types.ClassesEnums].push(data)
    }

    for (const idx in activityModels) {
      const data = activityModels[idx].toJSON()
      payload[Types.ActivityEnums].push(data)
    }

    for (const idx in paymentModels) {
      const data = paymentModels[idx].toJSON()
      payload[Types.PaymentsEnums].push(data)
    }

    for (const idx in paymentDetailModels) {
      const data = paymentDetailModels[idx].toJSON()
      payload[Types.PaymentDetailsEnums].push(data)
    }

    for (const idx in studentClassModels) {
      const data = studentClassModels[idx].toJSON()
      payload[Types.StudentsClassEnums].push(data)
    }

    for (const idx in studentModels) {
      const data = studentModels[idx].toJSON()
      payload[Types.StudentsEnums].push(data)
    }

    return payload
  }

  private createFile() {
    return
  }
}