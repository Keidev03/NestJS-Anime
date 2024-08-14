import mongoose from "mongoose"

export interface IType {
    id: number
    name: string
}

export const TypeSchema = new mongoose.Schema({
    _id: { type: Number, require: true },
    name: { type: String, required: true, unique: true }
})