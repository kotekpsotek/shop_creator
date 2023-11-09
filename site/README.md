# Shop-Creating App
Platoform for creating and maintaining online shops

## Database usage

## **Tech Stack:**
- Languages:
    * Rust - For height efficient processing datas,
    * JavaScript:
        * TypeScript,
        * Node.js,
        * Svelte,

- Frameworks:
    * JavaScript Frontend:
        * Svelte,
    * Node.js backend:
        * Express.js
    
- Databases:
    * Cassandra,
    * MongoDB,
    * Redis

- Other Tools:
    - Container's virtaulization:
        - Docker,
    - Message Broker:
        - RabbitMQ with AMQP
    
    
## Data base's cases:
- *MongoDB* is for:
    * Shop creator itself user account data saving in `users` collection,

- *Cassandra* is for:
    - Use keyspace with name `shop_creator` where saves such tables:
        * **`shop`** - which save data about each in app shop,
        * **`items`** - which save data about items from each shop with meta data like ammount

- *Redis* is for:
    - Store and take actions on each logged-in user session under key ``
