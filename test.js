const uuid = require('uuid')
const {Duplex, Writable, Readable} = require('stream')
const kafka = require('kafka-node')

const bases = 'ACGT'

const client = new Readable({
  read(size) {
    if (this.index < this.num) {
      const base = bases[Math.floor(Math.random() * bases.length)]
      const event = {patientId: this.patientId, index: this.index, base}
      // const buffer = new Buffer.from(JSON.stringify(event))
      this.topics.forEach(topic => {
        console.log('reading')
        this.push(new Buffer.from(JSON.stringify({topic, messages: event})))
      })
      // console.log({topic: this.topics, messages:buffer})
      // this.push({topic: this.topics, messages:buffer})
      this.index++
      // send to front end here to display as a sequence (an array)
    } else {
      this.push('end')
    }
  }
})

client.patientId = uuid.v4()
client.num = 10
client.index = 0
client.topics = ['TESTTEST']
client.addTopic = topic => this.topics.push(topic)

// client.on('data', (chunk) => {
//   console.log(`Received ${chunk.length} bytes of data.`);
//   client.pause();
//   console.log('There will be no additional data for 1 second.');
//   setTimeout(() => {
//     console.log('Now data will start flowing again.');
//     client.resume();
//   }, 1000);
// });

class Client extends Readable {
  constructor(num, topics) {
    super({objectMode: true})
    this.patientId = uuid.v4()
    this.num = num
    this.index = 0
    this.topics = typeof topic === 'object' ? topics : [topics]
  }

  // write(chunk, encoding, callback) {
  //   //   console.log(chunk.toString())
  //   callback()
  // }

  read(size) {
    if (this.index < this.num) {
      const base = bases[Math.floor(Math.random() * bases.length)]
      const event = {patientId: this.patientId, index: this.index, base}
      const buffer = new Buffer.from(JSON.stringify(event))
      //   this.topics.forEach(topic => {
      //     // console.log({topic, messages: buffer})
      //     this.push({topic, messages: buffer})
      // })
      // console.log({topic: this.topics, messages:buffer})
      console.dir(this.push)
      this.push({topic: this.topics, messages: buffer})
      this.index++
      // send to front end here to display as a sequence (an array)
    } else {
      this.push(null)
    }
  }

  addTopic(topic) {
    this.topics.push(topic)
  }
}

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log(chunk.toString())
    callback()
  }
})

// var producer = new kafka.ProducerStream({
//   kafkaClient: 'localhost:2181',
// });

// var topicName = 'test';

// //logging debug messages, if debug is enabled
// producer.on('event.log', function(log) {
//   console.log(log);
// });

// //logging all errors
// producer.on('event.error', function(err) {
//   console.error('Error from producer');
//   console.error(err);
// });

// //counter to stop this sample after maxMessages are sent
// var counter = 0;
// var maxMessages = 10;

// producer.on('delivery-report', function(err, report) {
//   console.log('delivery-report: ' + JSON.stringify(report));
//   counter++;
// });

// //Wait for the ready event before producing
// producer.on('ready', function(arg) {
//   console.log('producer ready.' + JSON.stringify(arg));

//   for (var i = 0; i < maxMessages; i++) {
//     var value = Buffer.from('value-' +i);
//     var key = "key-"+i;
//     // if partition is set to -1, librdkafka will use the default partitioner
//     var partition = -1;
//     producer.produce(topicName, partition, value, key);
//   }

//   //need to keep polling for a while to ensure the delivery reports are received
//   var pollLoop = setInterval(function() {
//       producer.poll();
//       if (counter === maxMessages) {
//         clearInterval(pollLoop);
//         producer.disconnect();
//       }
//     }, 1000);

// });

// producer.on('disconnected', function(arg) {
//   console.log('producer disconnected. ' + JSON.stringify(arg));
// });

// //starting the producer
// producer.connect();

// console.log(producer)

// const main = async function() {
const kafkaClient = new kafka.KafkaClient(
  'http://localhost:2181',
  'my-client-id',
  {
    sessionTimeout: 300,
    spinDelay: 100,
    retries: 2
  }
)

const options = {
  kafkaClient: {kafkaHost: 'localhost:2181', clientId: 'my-client-id'}
}

//   const producer = await new kafka.ProducerStream(kafkaClient)

const producer = new kafka.ProducerStream(options)
// console.log(producer)

// const consumer = new kafka.ConsumerStream(options)
// console.log(producer)

const consumer = new kafka.ConsumerStream(kafkaClient, ['test'], {
  objectMode: true
})

// // For this demo we just log producer errors to the console.
// producer.on('error', function(error) {
//   console.error(error)
// })

// producer.on('ready', function() {
//   console.log('Kafka Producer is connected and ready.')
// })

// const KafkaService = {
//   sendRecord: ({userId, base, index, topic}, callback = () => {}) => {
//     if (!bases.includes(base)) {
//       return callback(new Error(`Invalid base`))
//     }

//     const event = {
//       id: uuid.v4(),
//       timestamp: Date.now(),
//       userId,
//       data: {base, index}
//     }

//     const buffer = new Buffer.from(JSON.stringify(event))

//     // Create a new payload
//       const record = [
//         {
//           topic,
//           messages: buffer,
//           attributes: 1 /* Use GZip compression for the payload */
//         }
//       ]

//       //Send record to Kafka and log result/error
//       producer.send(record, callback)
//   }
// }

// module.exports = KafkaService

// const client1 = new Duplex({
//   write(chunk, encoding, callback) {
//     //   console.log(chunk.toString())
//     callback();
//   },

//   read() {
//     if (this.num<this.max) {
//         const base = bases[Math.floor(Math.random()*bases.length)]
//         console.log(base)
//         this.push(base);
//         this.num++
//     } else {
//      this.push(null)
//     }
//   }
// });

// client.num=0
// client.max = 10

// const client = new Client(10, 'TESTTEST')

//   client.pipe(producer).on('data', data => {
//     console.log('Produced!', data)
//   })
setInterval(() => {
  producer.write(client.read())
}, 1000)

// consumer.pipe(outStream)
