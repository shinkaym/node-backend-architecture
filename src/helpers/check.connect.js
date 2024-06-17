/* eslint-disable no-console */
import mongoose from 'mongoose'
import os from 'os'
import process from 'process'

const _SECOND = 5000

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections:: ${numConnection}`)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnections = numCores * 5

    console.log(`Active connections: ${numConnection}`)
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnection > maxConnections) {
      console.log('Connection overload detected!')
    }
  }, _SECOND)
}

export {
  countConnect,
  checkOverload
}