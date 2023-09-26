import { connect } from "amqplib";

const cdn = (async () => {
    const connection = await connect("amqp://localhost:5762");
    const channel = await connection.createChannel();

    return {
        connection,
        channel
    }
})();

// Create queues
(async () => {
    (await cdn).channel.assertQueue("created-shop-item");
})()

export default cdn;
