/* eslint-disable handle-callback-err */
const kafka = require('kafka-node')
const ServerProducer = require('./ServerProducer')
const serverProducer = ServerProducer()

const topics = []
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
}

const ServerConsumer = socket => {
  let client = new kafka.KafkaClient('http://localhost:2181')
  const consumer = new kafka.Consumer(client, topics, options)
  console.log('Creating consumer')

  client = new kafka.KafkaClient('http://localhost:2181')
  const admin = new kafka.Admin(client)
  admin.listTopics((err, topicsList) => {
    const filteredTopics = Object.keys(topicsList[1].metadata).filter(
      topic => !topic.startsWith('match') && topic !== '__consumer_offsets'
    )
    socket.emit('sendTopics', filteredTopics)
    console.log('sending topics', filteredTopics)
  })

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
    socket.emit('sendBase', {userId, base})
    if (matchingIndices[userId] === target.length) {
      const match = {userId, index: index - target.length + 2, target}
      socket.emit('sendMatch', match)
      serverProducer.sendRecord(match)
      matchingIndices[userId] = 0
    }
  })

  consumer.on('error', function(err) {
    console.log('error', err)
  })

  consumer.listTopics = () => {
    return admin.listTopics((err, topicsList) => {
      return Object.keys(topicsList[1].metadata).filter(
        topic => !topic.startsWith('match') && topic !== '__consumer_offsets'
      )
    })
  }

  consumer.createTopic = topic => {
    admin.createTopics([topic], (err, res) => {
      err ? console.log(err) : console.log(res)
    })
  }

  process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit()
    })
  })

  return consumer
}

module.exports = ServerConsumer
