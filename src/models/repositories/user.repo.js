import UserModel from '../user.model'

const createUser = async ({
  usr_id,
  usr_name,
  usr_email,
  usr_slug,
  usr_password,
  usr_role
}) => {
  return await UserModel.create({
    usr_id,
    usr_name,
    usr_email,
    usr_slug,
    usr_password,
    usr_role
  })
}

export {
  createUser
}