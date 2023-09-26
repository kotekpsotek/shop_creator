import amqp from "amqplib";
import { describe, test, beforeAll } from "vitest";

async function createConnection() {
    const connection = await amqp.connect("amqp://localhost:5762");
    const channel = await connection.createChannel();

    return { connection, channel };
};

const queueName = "messages";

beforeAll(async () => {
    const { channel } = await createConnection();

    channel.consume(queueName, async (msg) => {
        // channel.deleteQueue(queueName)
        console.log(`Message received ${msg?.content}`);
    })
});

test("RabbitMQ queue send message", async () => {
    const { channel } = await createConnection();

    const message = "1st message";

    await channel.assertQueue(queueName, { durable: false, arguments: {} });
    channel.sendToQueue(queueName, Buffer.from(message));
})