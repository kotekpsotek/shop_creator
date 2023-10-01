use futures_lite::stream::StreamExt;
use lapin::{options::*, types::FieldTable, Connection, ConnectionProperties};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct ShopFunds {
    shop_id: String,
    funds_in_ware: u128,
    income_gross: u128,
    income_net: u128,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct File {
    results: Vec<ShopFunds>,
}

impl File {}

#[allow(dead_code)]
#[derive(Deserialize, Debug)]
struct ShopCreatedItem {
    #[serde(rename(deserialize = "itemId"))]
    item_id: String,
    shop_id: String,
}

#[tokio::main]
async fn main() {
    // Create connection
    let conn = Connection::connect("amqp://localhost:5762", ConnectionProperties::default())
        .await
        .unwrap();

    println!("CONNECTED");

    let channel_a = conn.create_channel().await.unwrap();
    let mut consumer = channel_a
        .basic_consume(
            "created-shop-item",
            "",
            BasicConsumeOptions::default(),
            FieldTable::default(),
        )
        .await
        .unwrap();

    tokio::spawn(async move {
        loop {
            while let Some(delivery) = consumer.next().await {
                let delivery = delivery.expect("error in consumer");
                let msg_str = String::from_utf8(delivery.data).unwrap();
                let msg_jsp = serde_json::from_str::<ShopCreatedItem>(&msg_str)
                    .unwrap();

                println!("{msg_jsp:?}");
    
                todo!("Send ACKNOWLEDGE about read to RabbitMQ after whole read and successfull analize action");
                // delivery
                //     .ack(BasicAckOptions::default())
                //     .await
                //     .expect("ack");
            }
        }
    }).await.unwrap();
}
