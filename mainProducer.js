const Producer = require('./producer')

const bases = 'ACGT'

const type = 'DNA'
const userId = 1
const sessionId = 1

setInterval(() => {
  const data = bases[Math.floor(Math.random() * bases.length)]
  const record = {type, userId, sessionId, data}
  Producer.sendRecord(record)
  console.log('sent record:', record)
}, 1000)
