// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { sequelize, Student } from "../../getdb"
import { Op } from "sequelize"
import { StudentPaginatedPayload } from "../enums/paginated"
import { Student as model } from "../model/student"
import { create as createActivity } from "@/db/action/activity"
import { entityStudent } from "../enums/activity"
import { entityCreate, entityUpdate } from "../model/activity"

const queryPaginated = `
    SELECT 
        students.*, 
        classes.name as className 
    FROM 
        student_class 
    JOIN
        students on student_class.student_id=students.id
    JOIN 
        classes ON student_class.class_id=classes.id 
    WHERE 
        students.name LIKE '%{keyword}%' 
        AND (classes.id = '{class}' OR 1 = {classOp})
        AND student_class.is_active = true
    ORDER BY classes.id ASC, students.id ASC
    LIMIT {limit} OFFSET {offset};
`
const countPaginated = `
    SELECT 
        COUNT(students.id) as count 
    FROM 
        student_class 
    JOIN
        students on student_class.student_id=students.id
    JOIN 
        classes ON student_class.class_id=classes.id 
    WHERE 
        students.name LIKE '%{keyword}%' 
        AND (classes.id = '{class}' OR 1 = {classOp})
        AND student_class.is_active = true
    `

const findByIdQuery = `
    SELECT 
        students.*
    FROM 
        students
    WHERE 
        students.id={studentId}`
const findByNameAndClassIdQuery = `
    SELECT 
        students.*, 
        classes.name as className 
    FROM 
        students 
    JOIN 
        student_class ON student_class.student_id=students.id 
    JOIN 
        classes ON student_class.class_id=classes.id 
    WHERE 
        students.name="{name}" 
        AND student_class.class_id ={classId}
    ORDER BY student_class.created_at ASC`


export interface NewStudent {
    name: string | null;
    address: string | null;
    semester: number | null;
    gender: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
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

    const result = await Student.findOne({
        where: {
            Id: id.toString()
        }
    })

    return result
}

const findByIds = async (ids: Array<number>) => {
    const result = await Student.findAll({
        where: {
            Id: { [Op.in]: ids }
        }
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

const findByName = async (name: string) => {
    const result = await Student.findOne({
        where: {
            Name: name
        }
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
    if (!student.createdAt) {
        student.createdAt = new Date
    }

    const retData = await Student.create(student)
    await createActivity({
        type: entityCreate,
        payload: retData,
        entityId: retData.id,
        entity: entityStudent,
    })
    return retData.id
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

const findAll = async () => {
    const result = await Student.findAll()
    return result
}

const isExist = async (name: string) => {
    const result = await Student.findOne({ where: { name: name } })

    return result?.id
}

export { getAll, create, findPaginated, findById, findByIds, countStudents, update, findByNameAndClassId, findAll, isExist, findByName }