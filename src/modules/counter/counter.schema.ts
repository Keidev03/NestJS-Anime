import mongoose from "mongoose";

export interface ICounter {
    id: string
    sequence_value: number
}

export const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 0 }
});