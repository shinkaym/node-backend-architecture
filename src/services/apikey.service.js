import ApiKeyModel from '~/models/apikey.model'

class ApiKeyService {
  static findById = async (key) => {
    const objKey = await ApiKeyModel.findOne({ key, status: true }).lean()
    return objKey
  }
}

export default ApiKeyService