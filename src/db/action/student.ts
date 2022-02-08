// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { sequelize, Student } from "../../getdb"
import { StudentPaginatedPayload } from "../enums/paginated"
import { Student as model } from "../model/student"
import { create as createActivity } from "@/db/action/activity"
import { entityStudent } from "../enums/activity"
import { entityCreate, entityUpdate } from "../model/activity"

const queryPaginated = "SELECT students.*, classes.name as className FROM students JOIN classes ON students.class_id=classes.id WHERE students.name LIKE '%{keyword}%' AND (classes.id = '{class}' OR 1 = {classOp}) LIMIT {limit} OFFSET {offset};"
const countPaginated = "SELECT COUNT(students.id) as count FROM students JOIN classes ON students.class_id=classes.id WHERE students.name LIKE '%{keyword}%' AND (classes.id = '{class}' OR 1 = {classOp})"

const findByIdQuery = "SELECT students.*, classes.name as className FROM students JOIN classes ON students.class_id=classes.id WHERE students.id={studentId}"
const findByNameAndClassIdQuery = `SELECT students.*, classes.name as className FROM students JOIN classes ON students.class_id=classes.id WHERE students.name="{name}" AND students.class_id ={classId}`

interface NewStudent {
    name: string | null;
    classId: number | null;
    address: string | null;
    semester: number | null;
    gender: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    academicYear: string | null;
    isOrphan: boolean | null;
    id?: number | null;
}
interface StudentResult {
    rows: Array<model>;
    count: number | 0;
}
/** 
 * Returns all Students
 * @method getAllUsers
 * @returns {Array<Student>} All Users belonging to User Model 
*/
const getAll = async () => {
    const students = await Student.findAll()
    return students
}

const findById = async (id: number) => {
    let result: any

    let findQuery = findByIdQuery

    findQuery = findQuery.replace('{studentId}', id.toString())

    await sequelize.query(findQuery).then((res: any) => {
        result = res[0][0]
    })

    return result
}

const findByNameAndClassId = async (name: string, classId: number) => {
    let result: any

    let findQuery = findByNameAndClassIdQuery

    findQuery = findQuery.replace('{name}', name)
    findQuery = findQuery.replace('{classId}', classId.toString())

    await sequelize.query(findQuery).then((res: any) => {
        result = res[0][0]
    })

    return result
}

const countStudents = async () => {
    let countQuery = countPaginated
    let count = 0

    countQuery = countQuery.replace('{keyword}', "")
    countQuery = countQuery.replace('{class}', "")
    countQuery = countQuery.replace('{classOp}', "1")

    await sequelize.query(countQuery).then(async (res: any) => {
        if (res[0].length > 0) {
            count = res[0][0].count
        }
    })

    return count
}


/** 
 * Returns all Students
 * @method findPaginated
 * @param {PaginatedPayload} student the user object
 * @returns {StudentResult} the created User Object
*/
const findPaginated = async (payload: StudentPaginatedPayload) => {
    const result: StudentResult = {
        rows: [],
        count: 0
    }
    let findQuery = queryPaginated
    let countQuery = countPaginated

    findQuery = findQuery.replace('{keyword}', payload.name.trim())
    countQuery = countQuery.replace('{keyword}', payload.name.trim())

    if (payload.classId && payload.classId != '') {
        findQuery = findQuery.replace('{class}', payload.classId)
        countQuery = countQuery.replace('{class}', payload.classId)

        findQuery = findQuery.replace('{classOp}', "0")
        countQuery = countQuery.replace('{classOp}', "0")

    } else {
        findQuery = findQuery.replace('{class}', "")
        countQuery = countQuery.replace('{class}', "")

        findQuery = findQuery.replace('{classOp}', "1")
        countQuery = countQuery.replace('{classOp}', "1")
    }

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
 * Returns all Students
 * @method createUser
 * @param {NewStudent} student the user object
 * @returns {NewStudent} the created User Object
*/
const create = async (student: NewStudent) => {
    student.createdAt = new Date
    const retData = await Student.create(student)
    await createActivity({
        type: entityCreate,
        payload: retData,
        entityId: retData.id,
        entity: entityStudent,
    })

    const addedUser: NewStudent = {
        name: retData.name,
        classId: retData.classId,
        address: retData.address,
        gender: retData.gender,
        semester: retData.semester,
        isOrphan: retData.isOrphan,
        academicYear: retData.academicYear,
        createdAt: new Date,
        id: retData.id,
    }
    return addedUser
}

const update = async (student: Student) => {
    await student.save()

    await createActivity({
        type: entityUpdate,
        payload: student,
        entityId: student.id,
        entity: entityStudent,
    })

    return student
}

export { getAll, create, findPaginated, findById, countStudents, update, findByNameAndClassId }