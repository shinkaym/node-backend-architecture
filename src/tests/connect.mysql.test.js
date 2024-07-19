const mysql2 = require('mysql2')

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'shinkaym',
  password: 'khoa',
  database:'shopDEV'
})

const batchSize = 100000
const totalSize = 10_000_000

let currentId = 1

console.time(':::::::::::::TIME:::')
const insertBatch = async () => { 
  const values = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = 'name-' + currentId
    const age = currentId
    const address = 'address-' + currentId
    values.push([currentId, name, age, address])
    currentId++
  }

  if (!values.length) {
    console.timeEnd(':::::::::::::TIME:::')
    pool.end(err => {
      if (err) console.log('error occurred while running batch')
      else console.log('Connection closed')
    })
    return
  }

  const sql = 'insert into test_table (id, name, age, address) values ?'

  pool.query(sql, [values], async (err, res) => {
    if (err) throw err
    console.log('Inserted: ', res.affectedRows)
    await insertBatch()
  })
}

insertBatch().catch(console.error)

// pool.query('select * from users', (err, res) => {
//   if (err) throw err
//   console.log('result: ', res)

//   pool.end(err => {
//     if (err) throw err
//     console.log('MySQL connection pool closed.')
//   })
// })