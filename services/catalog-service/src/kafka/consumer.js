const { Kafka } = require("kafkajs");
const Product = require("../models/productModel");

const kafka = new Kafka({
  clientId: "catalog-service",
  brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "catalog-group" });

const connectConsumer = async () => {
  await consumer.connect();
  console.log("Catalog Service Kafka consumer connected");
};

const startConsuming = async () => {
  await consumer.subscribe({ topics: ["order-created"], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Order created event received:`, data);

      try {
        const product = await Product.findById(data.productId);
        if (product && product.stock > 0) {
          product.stock -= data.quantity || 1;
          await product.save();
          console.log(
            `Stock updated for product ${data.productId}: ${product.stock} remaining`,
          );

          const { sendMessage } = require("../kafka/producer");

          await sendMessage("stock-updated", {
            productId: product._id,
            stock: product.stock,
          });
          console.log(`Stock-updated event sent for ${product.name}`);
        }
      } catch (err) {
        console.error("Error updating stock:", err.message);
      }
    },
  });
};

module.exports = { connectConsumer, startConsuming };