const Producer = require('./producer')

// const client = new Client(['AT'])

// const bases = ['A', 'C', 'G', 'T']

// let index = 0
// const start = {base: '>', index}
// client.sendRecord(start)
// const end = setInterval(() => {
//   const base = bases[Math.floor(Math.random() * bases.length)]
//     client.sendRecord({base, index})
//     console.log('sent record:', {base, index})
//   index++
// }, 1000)

// setTimeout(()=>{
//   clearInterval(end)
//     client.sendRecord({base: '.', index})
//   // Producer.sendRecord({type, userId, base: '.', index})
// }, 10000)

const bases = 'ACGT'

// const type = 'DNA'
const users = [
  {userId: '1', topics: ['A', 'TC']},
  {userId: '2', topics: ['A', 'GG']}
]

// Producer.sendRecord({type, userId, base: '>', index})

users.map(user => {
  let index = 0
  user.topics.map(topic => {
    Producer.sendRecord({userId: user.userId, base: '>', index, topic})
  })

  const end = setInterval(() => {
    const base = bases[Math.floor(Math.random() * bases.length)]
    user.topics.map(topic => {
      const record = {userId: user.userId, base, index, topic}
      Producer.sendRecord(record)
      console.log('sent record:', record)
    })
    index++
  }, 50)

  setTimeout(() => {
    clearInterval(end)
    user.topics.map(topic => {
      Producer.sendRecord({userId: user.userId, base: '.', index, topic})
    })
    // Producer.sendRecord({type, userId, base: '.', index})
  }, 5000)
})
