import { createConnection, Schema, SchemaTypes } from "mongoose";
import { randomUUID } from "crypto"
import * as redis from "redis";
import cassandra from "cassandra-driver";

// Conns
export const mDb = createConnection("mongodb://127.0.0.1:27017/service_shop_creator");
export const rDb = redis.createClient({ url: "redis://127.0.0.1:6379" });
rDb.connect();
export const cDb = new cassandra.Client({
    keyspace: "shop_creator",
    contactPoints: ["127.0.0.1"],
    localDataCenter: "datacenter1",
});
cDb.connect();

// Schemas
export interface User {
    email: String,
    password: string,
    date: Date,
    uuid: String ,
    sid: string,
}

const usersSchema = new Schema<User>({
    email: { type: SchemaTypes.String, required: true, unique: true },
    password: { type: SchemaTypes.String, required: true },
    date: { type: Date, default: () => new Date() },
    uuid: { type: String, default: () => randomUUID(), unique: true },
    sid: { type: String }
}, {
    // strict: true, // Don't allow to use not defined keys in shema
});

// Mods
export const mUsers = mDb.model("users", usersSchema);