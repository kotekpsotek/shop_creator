import ampq from "amqplib";

class PacketMq {
    connection: Promise<ampq.Connection>;
    channel: Promise<ampq.Channel>;
    
    constructor() {
        this.connection = (async () => {
            return await ampq.connect("amqp://localhost");
        })();
        this.channel = (async () => {
            return await (await this.connection).createChannel()
        })();
    }

    async createExchangeWithPublish(exchange_name: string, qname: string, message: string) {
        // const queue = await (await this.channel).assertQueue(qname);
        await (await this.channel).assertExchange(exchange_name, "topic");
        (await this.channel).bindQueue(qname, exchange_name, '');
        (await this.channel).publish(exchange_name, '', Buffer.from(message));

    }
}

