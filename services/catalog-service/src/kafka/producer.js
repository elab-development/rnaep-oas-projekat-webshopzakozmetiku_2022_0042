const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'catalog-service-producer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Catalog Service Kafka producer connected');
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });
};

module.exports = { connectProducer, sendMessage };