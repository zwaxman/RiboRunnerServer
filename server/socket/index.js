// const consumer = require('../../consumer1')
const ServerConsumer = require('../../ServerConsumer')

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    const serverConsumer = ServerConsumer(socket)
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
    socket.on('createTopic', ({topics}) => serverConsumer.createTopic(topics))
    socket.on('addTopics', ({topics}) =>
      serverConsumer.addTopics(
        typeof topics === 'object' ? topics : [topics],
        () => {}
      )
    )
    // Using below will get messages from earliest offset
    // socket.on('addTopics', ({topics}) =>
    //   serverConsumer.addTopics(
    //     typeof topics === 'object' ? topics.map(topic => ({topic, offset:'earliest'})) : [{topic: topics, offest: 'earliest'}],
    //     () => {}, true
    //   )
    // )
    socket.on('removeTopic', ({topic}) =>
      serverConsumer.removeTopics([topic], () => {})
    )
    socket.on('addTarget', target => {
      console.log(target)
    })
    socket.on('removeTarget', target => {
      console.log(target)
    })
  })
}
