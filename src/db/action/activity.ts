// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { Activity, sequelize } from "../../getdb"
import { ActivityPaginatedPayload } from "@/db/enums/paginated"
import { Activity as model } from "../model/activity"
import { BackupHandler } from "@/handlers/backup";

interface NewActivity {
  payload: any | null;
  entityId: number | null;
  entity: string | null;
  type: string | null;
  id?: number | null;
}

const findPaginatedQuery = `
  SELECT
      activities.* 
    FROM
      activities
    WHERE
      activities.entity LIKE '%{entity}%'
    ORDER BY 
      activities.id DESC
    LIMIT {limit} OFFSET {offset}
`

const countPaginatedQuery = `
  SELECT
      COUNT(activities.id) as count
    FROM
      activities
    WHERE
      activities.entity LIKE '%{entity}%'
`

interface ActivityResult {
  rows: Array<model>;
  count: number | 0;
}

/** 
 * Returns all Users
 * @method getAllUsers
 * @returns {Array<NewActivity>} All Users belonging to User Model 
*/
const findPaginated = async (payload: ActivityPaginatedPayload) => {
  const result: ActivityResult = {
    rows: [],
    count: 0
  }

  let findQuery = findPaginatedQuery
  let countQuery = countPaginatedQuery

  findQuery = findQuery.replace('{entity}', payload.entity.trim())
  countQuery = countQuery.replace('{entity}', payload.entity.trim())

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
 * @param {NewActivity} user the user object
 * @returns {NewActivity} the created User Object
*/
const create = async (user: NewActivity) => {
  user.payload = JSON.stringify(user.payload)
  await Activity.create(user)

  const handler = new BackupHandler();
  handler.createBackup(true);
  return true
}

const findAll =  async () => {
  const result = await Activity.findAll()

  return result
}

export { findPaginated, create, findAll }