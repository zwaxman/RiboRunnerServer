/* eslint-disable handle-callback-err */
const kafka = require('kafka-node')
const ServerProducer = require('./ServerProducer')
const serverProducer = ServerProducer()

const initialTopics = []
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
}

const ServerConsumer = socket => {
  let client = new kafka.KafkaClient('http://localhost:2181')
  const consumer = new kafka.Consumer(client, initialTopics, options)
  consumer.topics = initialTopics
  consumer.targets = new Map()

  consumer._addTopics = function(topics) {
    topics = typeof topics === 'object' ? topics : [topics]
    this.addTopics(topics, () => {})
    this.topics = [...this.topics, ...topics]
  }

  consumer._removeTopic = function(topic) {
    this.removeTopics([topic], () => {})
    this.topics = this.topics.filter(t => t !== topic)
  }

  consumer._addTarget = function(target) {
    this.targets.set(target.sequence, target.description)
  }

  consumer._removeTarget = function(target) {
    this.targets.delete(target)
  }

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

  const users = new Map()

  consumer.on('message', function(message) {
    var buf = new Buffer(message.value, 'binary')
    var decodedMessage = JSON.parse(buf.toString())
    let {userId, base, index} = decodedMessage
    socket.emit('sendBase', {userId, base})

    if (!users.has(userId)) {
      users.set(userId, new Map())
    }

    const user = users.get(userId)
    Array.from(consumer.targets.keys()).forEach(targetSequence => {
      if (!user.has(targetSequence)) {
        user.set(targetSequence, 0)
      }
      let numMatchingIndices = user.get(targetSequence)
      if (base === targetSequence[numMatchingIndices]) {
        numMatchingIndices++
        if (numMatchingIndices === targetSequence.length) {
          const match = {
            userId,
            index: index - targetSequence.length + 2,
            target: targetSequence,
            description: consumer.targets.get(targetSequence),
            topics: consumer.topics
          }
          socket.emit('sendMatch', match)
          serverProducer.sendRecord(match)
          numMatchingIndices = 0
        }
      } else {
        numMatchingIndices = +(base === targetSequence[0])
      }
      user.set(targetSequence, numMatchingIndices)
    })
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
