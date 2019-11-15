const kafka = require('kafka-node')

const client = new kafka.KafkaClient('http://localhost:2181')

const topics = [
  {
    topic: process.env.TOPIC || 'AAA'
  }
]
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
}

const createConsumer = io => {
  const consumer = new kafka.Consumer(client, topics, options)
  console.log(process.env.TARGET)
  const target = process.env.TARGET || 'AAA'
  let matchingIndices = {}

  consumer.on('message', function(message) {
    // Read string into a buffer.
    var buf = new Buffer(message.value, 'binary')
    var decodedMessage = JSON.parse(buf.toString())
    let {userId, base, index} = decodedMessage
    //Events is a Sequelize Model Object.
    // return Events.create({
    //     id: decodedMessage.id,
    //     type: decodedMessage.type,
    //     userId: decodedMessage.userId,
    //     sessionId: decodedMessage.sessionId,
    //     data: JSON.stringify(decodedMessage.data),
    //     createdAt: new Date()
    // });
    if (!matchingIndices[userId]) {
      matchingIndices[userId] = 0
    }
    if (base === target[matchingIndices[userId]]) {
      matchingIndices[userId]++
    } else {
      matchingIndices[userId] = 0
    }
    io.emit('sendBase', {userId, base})
    if (matchingIndices[userId] === target.length) {
      io.emit('sendMatch', {userId, index: index - target.length + 2, target})
      matchingIndices[userId] = 0
    }
  })

  consumer.on('error', function(err) {
    console.log('error', err)
  })

  process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit()
    })
  })

  return consumer
}

module.exports = createConsumer
