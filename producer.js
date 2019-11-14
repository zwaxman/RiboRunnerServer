// const kafka = require('kafka-node');
// const bp = require('body-parser');
// const config = require('./config');

// try {
//   const Producer = kafka.Producer;
//   const client = new kafka.KafkaClient(config.kafka_server);
//   const producer = new Producer(client);
//   const kafka_topic = 'example';
//   console.log(kafka_topic);
//   let payloads = [
//     {
//       topic: kafka_topic,
//       messages: config.kafka_topic
//     }
//   ];

//   producer.on('ready', async function() {
//     let push_status = producer.send(payloads, (err, data) => {
//       if (err) {
//         console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
//         console.log(err)
//       } else {
//         console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
//       }
//     });
//   });

//   producer.on('error', function(err) {
//     console.log(err);
//     console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
//     throw err;
//   });
// }
// catch(e) {
//   console.log(e);
// }

const kafka = require('kafka-node')
const uuid = require('uuid')

const bases = 'ACGT'

const client = new kafka.KafkaClient('http://localhost:2181', 'my-client-id', {
  sessionTimeout: 300,
  spinDelay: 100,
  retries: 2
})

const producer = new kafka.HighLevelProducer(client)
producer.on('ready', function() {
  console.log('Kafka Producer is connected and ready.')
})

// For this demo we just log producer errors to the console.
producer.on('error', function(error) {
  console.error(error)
})

const KafkaService = {
  sendRecord: ({type, userId, sessionId, data}, callback = () => {}) => {
    if (!bases.includes(data)) {
      return callback(new Error(`A userId must be provided.`))
    }

    const event = {
      id: uuid.v4(),
      timestamp: Date.now(),
      userId: userId,
      sessionId: sessionId,
      type: type,
      data: data
    }

    const buffer = new Buffer.from(JSON.stringify(event))

    // Create a new payload
    const record = [
      {
        topic: 'webevents.dev',
        messages: buffer,
        attributes: 1 /* Use GZip compression for the payload */
      }
    ]

    //Send record to Kafka and log result/error
    producer.send(record, callback)
  }
}

module.exports = KafkaService
