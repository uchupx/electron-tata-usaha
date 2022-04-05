import { AcademicYear,sequelize } from "@/getdb"

interface NewClass {
  label: string | null;
  id?: number | null;
}

const findAcademicYearByStudentIdQuery = `
  SELECT
    academic_years.*,
    classes.name as className
  FROM
    academic_years 
  JOIN
    student_class ON academic_years.id=student_class.academic_year_id 
  JOIN 
    classes on classes.id=student_class.class_id
  WHERE 
    student_class.student_id={studentId};
`

const isExist = async (label: string) => {
  const result = await AcademicYear.findOne({ where: { label: label } })

  return result?.id
}

const findAll = async () => {
  const result = await AcademicYear.findAll()

  return result
}

const create = async (data: NewClass) => {
  const retData = await AcademicYear.create(data)
  return retData.id
}

const findAcademicYearByStudentId = async (studentId: number) => {
  let result: any

  let findQuery = findAcademicYearByStudentIdQuery

  findQuery = findQuery.replace('{studentId}', studentId.toString())

  await sequelize.query(findQuery).then((res: any) => {
    result = res[0]
  })

  return result
}

const update = async (data: AcademicYear) => {
  await data.save()

  return data.id
}


export { isExist, create, findAll, findAcademicYearByStudentId, update }