import { createConnection, Schema, SchemaTypes } from "mongoose";
import { randomUUID } from "crypto"

// Conns
const mDb = createConnection("mongodb://127.0.0.1:27017/service_shop_creator")

// Schemas
export interface User {
    email: String,
    password: String,
    date: Date,
    uuid: String 
}

const usersSchema = new Schema<User>({
    email: { type: SchemaTypes.String, required: true, unique: true },
    password: { type: SchemaTypes.String, required: true },
    date: { type: Date, default: () => new Date() },
    uuid: { type: String, default: () => randomUUID(), unique: true }
}, {
    strict: true, // Don't allow to use not defined keys in shema
});

// Mods
export const mUsers = mDb.model("users", usersSchema);