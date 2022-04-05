import { StudentClass, sequelize} from "@/getdb"

export interface NewClass {
  studentId: number | null;
  classId: number | null;
  academicYearId: number | null;
  createdAt?: Date | null;
  isActive: boolean | false;
  id?: number | null;
}
const findByStudentIdQuery = `
  SELECT
      classes.name as className,
      academic_years.label as academicYear,
      academic_years.id as academicYearId
  FROM
      student_class
  JOIN
      students ON student_class.student_id=students.id 
  JOIN 
      classes ON student_class.class_id=classes.id
  JOIN 
      academic_years ON student_class.academic_year_id=academic_years.id
  WHERE
      students.id = {studentId}
`


const findByStudentId = async (studentId: number) => {
  let result: any

  let findQuery = findByStudentIdQuery

  findQuery = findQuery.replace('{studentId}', studentId.toString())

  await sequelize.query(findQuery).then((res: any) => {
      result = res[0]
  })

  return result
}

const isExist = async (classId: number, academicYearId: number, studentId: number) => {
  const result = await StudentClass.findOne({
    where: {
      classId: classId,
      academicYearId: academicYearId,
      studentId: studentId,
    }
  })

  return result
}

// const isClassExist = async (name: string) => {
//   const result = await StudentClass.findOne({
//     where: {
//       name: name
//     }
//   })

//   return result?.id
// }

const findByModelStudentId = async (studentId: number) => {
  const results = await StudentClass.findAll({
    where: {
      studentId: studentId
    }
  })

  return results
}

const create = async (data: NewClass) => {
  data.createdAt = new Date
  const retData = await StudentClass.create(data)
  return retData.id
}

const update = async (data: StudentClass) => {
  await data.save()
  return data.id
}

const findAll = async () => {
  const result = await StudentClass.findAll()

  return result
}

export { findByStudentId, isExist ,create, update, findByModelStudentId, findAll }