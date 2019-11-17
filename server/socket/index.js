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
    socket.on('removeTopic', ({topic}) =>
      serverConsumer.removeTopics([topic], () => {})
    )
  })
}
