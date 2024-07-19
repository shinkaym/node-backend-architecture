/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
import mongoose from 'mongoose'
import mongodbConfig from '~/configs/mongodb.config'

const connectString = `mongodb://${mongodbConfig.db.host}:${mongodbConfig.db.port}/${mongodbConfig.db.name}`

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connect(connectString, { maxPoolSize: 50 })
      .then( () => console.log('Connected Mongodb Successfully!'))
      .catch(() => console.log('Connected Mongodb Failed!'))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance

export default instanceMongodb