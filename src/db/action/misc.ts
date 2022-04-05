import { sequelize } from "@/getdb";


const reset = async () => {
  await sequelize.query(`
    SELECT 
        name
    FROM 
      sqlite_master
    WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';`).then(async (res: any) => {
    const tables = res[0]

    for (const idx in tables) {
      const tableName = tables[idx]
      
      await sequelize.query(`DELETE FROM ${tableName.name}`)
    }
  })

  return
}

export { reset }