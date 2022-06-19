// todo this file provides an API to interact with the db users 
//todo table making it easier to work with
import { User } from "../../getdb"

const findUserByUsernamePassword = async (username: string, password: string) => {
    const result = await User.findOne({
        where: {
            Username: username,
            Password: password
        }
    })

    return result

}

export { findUserByUsernamePassword }