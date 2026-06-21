const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "recommendation-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "recommendation-group" });
const producer = kafka.producer();

const connectKafka = async () => {
  await consumer.connect();
  await producer.connect();
  console.log("Kafka consumer/producer connected");
};

const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

const startConsuming = async (recommendationController) => {
  await consumer.subscribe({
    topics: [
      "order-created",
      "beauty-profile-updated",
      "stock-updated",
      "review-submitted",
    ],
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Received message from topic ${topic}:`, data);

      if (topic === "order-created") {
        await recommendationController.updateAfterPurchaseKafka(data);
      }

      if (topic === "beauty-profile-updated") {
        await recommendationController.updateAfterBeautyProfileKafka(data);
      }

      if (topic === "stock-updated") {
        await recommendationController.removeOutOfStockProduct(data);
      }
      if (topic === "review-submitted") {
        await recommendationController.updateAfterReviewKafka(data);
      }
    },
  });
};

module.exports = { connectKafka, startConsuming, sendMessage };
