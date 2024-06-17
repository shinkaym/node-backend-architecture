/* eslint-disable no-constant-condition */
/* eslint-disable no-console */
const { default: mongoose } = require('mongoose')

const connectString = 'mongodb://localhost:27017/shopDev'

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